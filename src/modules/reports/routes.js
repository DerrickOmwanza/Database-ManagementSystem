const express = require('express');

const requireAuth = require('../../shared/middleware/requireAuth');
const requireRole = require('../../shared/middleware/requireRole');
const reportController = require('./reportController');

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('Admin'));
router.get('/', reportController.index);

module.exports = router;
