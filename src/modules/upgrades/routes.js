const express = require('express');

const requireAuth = require('../../shared/middleware/requireAuth');
const upgradeController = require('./upgradeController');

const router = express.Router();

router.use(requireAuth);
router.get('/', upgradeController.index);
router.post('/', upgradeController.create);

module.exports = router;
