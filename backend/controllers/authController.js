const jwt = require('jsonwebtoken');
const User = require('../models/User');
const wrap = require('../middleware/asyncHandler');
const sign = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
const send = (user, res, code = 200) =>
  res.status(code).json({ token: sign(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
exports.register = wrap(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (await User.findOne({ email })) { res.status(400); throw new Error('Email already registered'); }
  send(await User.create({ name, email, password, role }), res, 201);
});
exports.login = wrap(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.matchPassword(req.body.password))) { res.status(401); throw new Error('Invalid email or password'); }
  send(user, res);
});
exports.me = (req, res) => res.json(req.user);
exports.listStaff = wrap(async (req, res) => res.json(await User.find().sort('name')));
