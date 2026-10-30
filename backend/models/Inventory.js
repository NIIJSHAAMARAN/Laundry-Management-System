const mongoose = require('mongoose');
module.exports = mongoose.model('Inventory', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  unit: { type: String, default: 'kg' },
  quantity: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 5 }
}, { timestamps: true }));
