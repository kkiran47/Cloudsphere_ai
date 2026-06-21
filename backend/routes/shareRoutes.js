const express = require('express');
const { createShareLink, getSharedFile } = require('../controllers/shareController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createShareLink);
router.post('/:linkId', getSharedFile); // Public endpoint, password checked in body

module.exports = router;
