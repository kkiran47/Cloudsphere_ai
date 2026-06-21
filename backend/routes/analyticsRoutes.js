const express = require('express');
const { getUserAnalytics, getSmartSuggestions } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/', getUserAnalytics);
router.get('/suggestions', getSmartSuggestions);

module.exports = router;
