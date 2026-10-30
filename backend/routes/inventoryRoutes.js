const r = require('express').Router();
const c = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');
r.use(protect);
r.route('/').get(c.list).post(authorize('admin'), c.create);
r.patch('/:id/adjust', c.adjust);
r.delete('/:id', authorize('admin'), c.remove);
module.exports = r;
