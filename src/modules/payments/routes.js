const express = require('express');

const requireAuth = require('../../shared/middleware/requireAuth');
const paymentController = require('./paymentController');

const router = express.Router();

router.use(requireAuth);
router.get('/', paymentController.index);
router.post('/monthly-charges', paymentController.createMonthlyCharge);
router.post('/settlements', paymentController.settleCharge);
router.post('/installations', paymentController.recordInstallation);
router.post('/reconnections', paymentController.reconnect);

module.exports = router;
