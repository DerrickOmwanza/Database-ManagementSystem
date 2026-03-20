const express = require('express');

const requireAuth = require('../../shared/middleware/requireAuth');
const infrastructureController = require('./infrastructureController');

const router = express.Router();

router.use(requireAuth);
router.get('/', infrastructureController.index);
router.post('/', infrastructureController.save);

module.exports = router;
