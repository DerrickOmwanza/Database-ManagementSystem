const asyncHandler = require('../../shared/utils/asyncHandler');
const paymentRepository = require('./paymentRepository');
const paymentService = require('./paymentService');
const auditLog = require('../../shared/utils/auditLog');

const index = asyncHandler(async (req, res) => {
  const data = await paymentService.getPaymentDashboard(paymentRepository);

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(200).json(data);
  }

  return res.render('payments/index', {
    title: 'Payments & Billing',
    pageHeading: 'Payments & Billing',
    pageDescription: 'Manage monthly charges, late payment settlement, installation fees, and reconnections.',
    ...data,
  });
});

const createMonthlyCharge = asyncHandler(async (req, res) => {
  const result = await paymentService.generateMonthlyCharge(req.body, paymentRepository);

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(201).json({
      message: 'Monthly charge generated successfully',
      ...result,
    });
  }

  req.flash('success', 'Monthly charge generated successfully');
  return res.redirect('/payments');
});

const settleCharge = asyncHandler(async (req, res) => {
  const result = await paymentService.settleMonthlyCharge(req.body, paymentRepository);

  await auditLog({
    userId: req.session.user ? req.session.user.id : null,
    action: 'SETTLE_PAYMENT',
    entity: 'payments',
    entityId: result.paymentId,
    description: `Payment #${result.paymentId} settled. Base: KSh ${result.baseAmount}, Fine: KSh ${result.fineAmount}, Total: KSh ${result.totalPaid}. Reconnect required: ${result.reconnectRequired}.`,
    ipAddress: req.ip,
  });

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(200).json({ message: 'Monthly charge settled successfully', ...result });
  }

  req.flash('success', 'Monthly charge settled successfully');
  return res.redirect('/payments');
});

const recordInstallation = asyncHandler(async (req, res) => {
  const result = await paymentService.recordInstallationPayment(req.body, paymentRepository);

  await auditLog({
    userId: req.session.user ? req.session.user.id : null,
    action: 'RECORD_INSTALLATION',
    entity: 'payments',
    entityId: result.paymentId,
    description: `Installation payment of KSh ${result.amount} recorded for institution #${req.body.institutionId}.`,
    ipAddress: req.ip,
  });

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(201).json({ message: 'Installation payment recorded successfully', ...result });
  }

  req.flash('success', 'Installation payment recorded successfully');
  return res.redirect('/payments');
});

const reconnect = asyncHandler(async (req, res) => {
  const result = await paymentService.processReconnection(req.body, paymentRepository);

  await auditLog({
    userId: req.session.user ? req.session.user.id : null,
    action: 'RECONNECTION',
    entity: 'institutions',
    entityId: result.institutionId,
    description: `Institution #${result.institutionId} reconnected. Reconnection fee: KSh ${result.amount}.`,
    ipAddress: req.ip,
  });

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(201).json({ message: 'Reconnection processed successfully', ...result });
  }

  req.flash('success', 'Reconnection processed successfully');
  return res.redirect('/payments');
});

module.exports = {
  index,
  createMonthlyCharge,
  settleCharge,
  recordInstallation,
  reconnect,
};
