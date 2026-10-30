const mongoose = require('mongoose');
module.exports = mongoose.model('Customer', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true },
  email: String,
  address: String
}, { timestamps: true }));
