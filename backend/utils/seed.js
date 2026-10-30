require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Inventory = require('../models/Inventory');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  if (!(await User.findOne({ email: 'admin@lms.com' })))
    await User.create({ name: 'Admin', email: 'admin@lms.com', password: 'admin123', role: 'admin' });
  for (const [name, unit, quantity, reorderLevel] of [['Detergent', 'kg', 40, 10], ['Softener', 'l', 20, 5], ['Stain remover', 'l', 8, 3]])
    await Inventory.updateOne({ name }, { name, unit, quantity, reorderLevel }, { upsert: true });
  console.log('Seeded. Login: admin@lms.com / admin123');
  process.exit();
})();
