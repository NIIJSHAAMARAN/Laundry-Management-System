const Customer = require('../models/Customer');
const wrap = require('../middleware/asyncHandler');
exports.list = wrap(async (req, res) => {
  const q = req.query.search;
  const filter = q ? { $or: [{ name: new RegExp(q, 'i') }, { phone: new RegExp(q) }] } : {};
  res.json(await Customer.find(filter).sort('-createdAt').limit(50));
});
exports.create = wrap(async (req, res) => res.status(201).json(await Customer.create(req.body)));
exports.update = wrap(async (req, res) => {
  const c = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!c) { res.status(404); throw new Error('Customer not found'); }
  res.json(c);
});
