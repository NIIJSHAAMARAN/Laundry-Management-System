const r = require('express').Router();
const c = require('../controllers/customerController');
const { protect } = require('../middleware/auth');
r.use(protect);
r.route('/').get(c.list).post(c.create);
r.put('/:id', c.update);
module.exports = r;
