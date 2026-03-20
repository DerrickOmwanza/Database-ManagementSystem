const express = require('express');

const requireAuth = require('../../shared/middleware/requireAuth');
const reportController = require('./reportController');

const router = express.Router();

router.use(requireAuth);
router.get('/', reportController.index);

module.exports = router;
