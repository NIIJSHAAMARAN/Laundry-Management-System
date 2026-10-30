const r = require('express').Router();
const c = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
r.post('/login', c.login);
r.post('/register', protect, authorize('admin'), c.register);
r.get('/me', protect, c.me);
r.get('/staff', protect, c.listStaff);
module.exports = r;
