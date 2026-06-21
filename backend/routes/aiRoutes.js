const express = require('express');
const { searchFiles, chatWithFiles, getFileInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/search', searchFiles);
router.post('/chat', chatWithFiles);
router.get('/insights/:id', getFileInsights);

module.exports = router;
