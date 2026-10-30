const Order = require('../models/Order');
const Customer = require('../models/Customer');
const wrap = require('../middleware/asyncHandler');
const notify = require('../utils/notify');
const { prices, addOns, expressMultiplier, deliveryFee } = require('../config/pricing');

const calc = ({ items, addOns: extras = [], express, delivery }) => {
  const priced = items.map(i => {
    const unitPrice = prices[i.garment]?.[i.service];
    if (unitPrice === undefined) throw new Error(`No price for ${i.garment} / ${i.service}`);
    return { ...i, unitPrice };
  });
  let subtotal = priced.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  subtotal += extras.reduce((s, a) => s + (addOns[a] || 0), 0);
  if (express) subtotal *= expressMultiplier;
  const fee = delivery ? deliveryFee : 0;
  return { priced, subtotal: Math.round(subtotal), fee, total: Math.round(subtotal) + fee };
};

exports.priceList = (req, res) => res.json({ prices, addOns, expressMultiplier, deliveryFee });

exports.create = wrap(async (req, res) => {
  const { customer, items } = req.body;
  if (!items?.length) { res.status(400); throw new Error('Add at least one item'); }
  if (!(await Customer.exists({ _id: customer }))) { res.status(404); throw new Error('Customer not found'); }
  let c;
  try { c = calc(req.body); } catch (e) { res.status(400); throw e; }
  const order = await Order.create({
    ...req.body, items: c.priced, subtotal: c.subtotal, deliveryFee: c.fee, total: c.total,
    paid: Math.min(req.body.paid || 0, c.total), createdBy: req.user._id
  });
  res.status(201).json(await order.populate('customer'));
});

exports.list = wrap(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.customer) filter.customer = req.query.customer;
  if (req.query.orderNo) filter.orderNo = Number(req.query.orderNo);
  res.json(await Order.find(filter).populate('customer', 'name phone').populate('assignedTo', 'name role').sort('-createdAt').limit(100));
});

exports.get = wrap(async (req, res) => {
  const o = await Order.findById(req.params.id).populate('customer').populate('assignedTo', 'name role').populate('history.by', 'name');
  if (!o) { res.status(404); throw new Error('Order not found'); }
  res.json(o);
});

exports.updateStatus = wrap(async (req, res) => {
  const o = await Order.findById(req.params.id).populate('customer');
  if (!o) { res.status(404); throw new Error('Order not found'); }
  if (!Order.STAGES.includes(req.body.status)) { res.status(400); throw new Error('Invalid status'); }
  o.status = req.body.status;
  o.history.push({ status: o.status, by: req.user._id });
  await o.save();
  if (o.status === 'Ready for Pickup') notify(o.customer.phone, `Your laundry order #${o.orderNo} is ready for collection.`);
  if (o.status === 'Out for Delivery') notify(o.customer.phone, `Your laundry order #${o.orderNo} is out for delivery.`);
  res.json(o);
});

exports.assign = wrap(async (req, res) => {
  const o = await Order.findByIdAndUpdate(req.params.id, { assignedTo: req.body.userId }, { new: true });
  if (!o) { res.status(404); throw new Error('Order not found'); }
  res.json(o);
});

exports.pay = wrap(async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o) { res.status(404); throw new Error('Order not found'); }
  o.paid = Math.min(o.paid + Number(req.body.amount || 0), o.total);
  if (req.body.mode) o.paymentMode = req.body.mode;
  await o.save();
  res.json(o);
});

exports.stats = wrap(async (req, res) => {
  const byStatus = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const [rev] = await Order.aggregate([{ $group: { _id: null, billed: { $sum: '$total' }, collected: { $sum: '$paid' } } }]);
  res.json({ byStatus, billed: rev?.billed || 0, collected: rev?.collected || 0 });
});
