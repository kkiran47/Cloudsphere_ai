const express = require('express');
const { getSystemStats, getAllUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/admin');

const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getSystemStats);
router.get('/users', getAllUsers);

module.exports = router;
