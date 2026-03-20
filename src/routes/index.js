const express = require('express');
const authRoutes = require('../modules/auth/routes');
const dashboardRoutes = require('../modules/dashboard/routes');
const infrastructureRoutes = require('../modules/infrastructure/routes');
const institutionRoutes = require('../modules/institutions/routes');
const paymentRoutes = require('../modules/payments/routes');
const reportRoutes = require('../modules/reports/routes');
const upgradeRoutes = require('../modules/upgrades/routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', dashboardRoutes);
router.use('/infrastructure', infrastructureRoutes);
router.use('/institutions', institutionRoutes);
router.use('/payments', paymentRoutes);
router.use('/reports', reportRoutes);
router.use('/upgrades', upgradeRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
