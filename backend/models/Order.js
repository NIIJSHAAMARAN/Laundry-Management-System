const mongoose = require('mongoose');

const Counter = mongoose.model('Counter', new mongoose.Schema({ _id: String, seq: Number }));
const STAGES = ['Received', 'Washing', 'Drying', 'Ironing', 'Ready for Pickup', 'Out for Delivery', 'Delivered'];

const orderSchema = new mongoose.Schema({
  orderNo: { type: Number, unique: true },
  tagId: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    garment: { type: String, required: true },
    service: { type: String, enum: ['wash', 'dry-clean', 'iron', 'fold'], required: true },
    qty: { type: Number, min: 1, required: true },
    unitPrice: Number
  }],
  addOns: [String],
  express: { type: Boolean, default: false },
  delivery: { type: Boolean, default: false },
  pickupSlot: Date,
  status: { type: String, enum: STAGES, default: 'Received' },
  history: [{ status: String, by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, at: { type: Date, default: Date.now } }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subtotal: Number, deliveryFee: Number, total: Number,
  paid: { type: Number, default: 0 },
  paymentMode: { type: String, enum: ['cash', 'card', 'upi', 'wallet'], default: 'cash' },
  paymentStatus: { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

orderSchema.pre('save', async function () {
  if (this.isNew) {
    const c = await Counter.findByIdAndUpdate('order', { $inc: { seq: 1 } }, { new: true, upsert: true });
    this.orderNo = 1044 + c.seq;
    this.tagId = `LMS-${this.orderNo}-${Date.now().toString(36).toUpperCase()}`;
    this.history.push({ status: this.status, by: this.createdBy });
  }
  this.paymentStatus = this.paid <= 0 ? 'unpaid' : this.paid >= this.total ? 'paid' : 'partial';
});

const Order = mongoose.model('Order', orderSchema);
Order.STAGES = STAGES;
module.exports = Order;