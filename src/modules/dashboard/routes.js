const express = require('express');

const requireAuth = require('../../shared/middleware/requireAuth');
const dashboardController = require('./dashboardController');

const router = express.Router();

router.get('/', requireAuth, dashboardController.index);

module.exports = router;
