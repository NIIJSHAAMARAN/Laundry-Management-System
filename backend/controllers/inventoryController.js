const Inventory = require('../models/Inventory');
const wrap = require('../middleware/asyncHandler');
exports.list = wrap(async (req, res) => {
  const items = await Inventory.find().sort('name');
  res.json(items.map(i => ({ ...i.toObject(), low: i.quantity <= i.reorderLevel })));
});
exports.create = wrap(async (req, res) => res.status(201).json(await Inventory.create(req.body)));
exports.adjust = wrap(async (req, res) => {
  const item = await Inventory.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('Item not found'); }
  item.quantity = Math.max(0, item.quantity + Number(req.body.delta));
  await item.save();
  res.json(item);
});
exports.remove = wrap(async (req, res) => { await Inventory.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); });
