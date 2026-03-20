const AppError = require('../../shared/errors/AppError');
const businessRules = require('../../config/businessRules');
const {
  toDateString,
  getLastDayOfMonth,
  getDisconnectionDeadline,
  isAfterDate,
} = require('../../shared/utils/dateUtils');
const {
  validateMonthlyChargeGeneration,
  validateChargeSettlement,
  validateInstallationPayment,
  validateReconnectionPayment,
} = require('./paymentValidators');

async function generateMonthlyCharge(payload, repository) {
  validateMonthlyChargeGeneration(payload);

  const institution = await repository.findInstitutionBillingProfile(Number(payload.institutionId));
  if (!institution) {
    throw new AppError('Institution not found', 404);
  }

  const existingCharge = await repository.findMonthlyCharge(
    Number(payload.institutionId),
    Number(payload.billingMonth),
    Number(payload.billingYear)
  );
  if (existingCharge) {
    throw new AppError('Monthly charge already exists for the selected billing period.', 409);
  }

  const dueDate = toDateString(
    getLastDayOfMonth(Number(payload.billingYear), Number(payload.billingMonth))
  );

  const paymentId = await repository.createMonthlyCharge({
    institutionId: Number(payload.institutionId),
    amount: Number(institution.monthly_cost),
    billingMonth: Number(payload.billingMonth),
    billingYear: Number(payload.billingYear),
    dueDate,
    notes: payload.notes || `Monthly charge for ${institution.speed_label}`,
  });

  return {
    paymentId,
    institutionId: Number(payload.institutionId),
    amount: Number(institution.monthly_cost),
    dueDate,
  };
}

async function settleMonthlyCharge(payload, repository) {
  validateChargeSettlement(payload);

  const payment = await repository.findPaymentById(Number(payload.paymentId));
  if (!payment) {
    throw new AppError('Payment charge not found', 404);
  }

  if (payment.payment_type !== 'Monthly') {
    throw new AppError('Only monthly charges can be settled through this action.', 400);
  }

  if (payment.status === 'Paid') {
    throw new AppError('This monthly charge has already been settled.', 409);
  }

  const paymentDate = payload.paymentDate;
  const dueDate = payment.due_date;
  let fineAmount = 0;
  let disconnectionCreated = false;
  let reconnectRequired = false;

  if (isAfterDate(paymentDate, dueDate)) {
    fineAmount = Number((Number(payment.amount) * businessRules.penalties.latePaymentRate).toFixed(2));

    await repository.createFineRecord({
      institutionId: payment.institution_id,
      paymentId: payment.id,
      baseAmount: Number(payment.amount),
      fineRate: businessRules.penalties.latePaymentRate,
      fineAmount,
      appliedDate: paymentDate,
    });

    await repository.createFinePayment({
      institutionId: payment.institution_id,
      amount: fineAmount,
      paymentDate,
      billingMonth: payment.billing_month,
      billingYear: payment.billing_year,
      dueDate,
      notes: `Late payment fine for monthly charge #${payment.id}`,
    });
  }

  const disconnectionDeadline = toDateString(
    getDisconnectionDeadline(Number(payment.billing_year), Number(payment.billing_month))
  );

  if (isAfterDate(paymentDate, disconnectionDeadline)) {
    const existingDisconnection = await repository.findLatestOpenDisconnection(payment.institution_id);

    if (!existingDisconnection) {
      await repository.createDisconnectionRecord({
        institutionId: payment.institution_id,
        effectiveDate: paymentDate,
        reason: 'Non-payment by disconnection deadline',
        outstandingBalance: Number(payment.amount),
        fineAmount,
        reconnectionFee: businessRules.fees.reconnection,
      });
      await repository.updateInstitutionStatus(payment.institution_id, 'Disconnected');
      disconnectionCreated = true;
    }

    reconnectRequired = true;
    await repository.markPaymentOverdue(
      payment.id,
      'Paid after disconnection deadline; reconnection required.'
    );
  }

  await repository.markPaymentSettled(
    payment.id,
    paymentDate,
    reconnectRequired
      ? 'Monthly charge settled after disconnection deadline.'
      : 'Monthly charge settled.'
  );

  return {
    paymentId: payment.id,
    baseAmount: Number(payment.amount),
    fineAmount,
    totalPaid: Number((Number(payment.amount) + fineAmount).toFixed(2)),
    reconnectRequired,
    disconnectionCreated,
  };
}

async function recordInstallationPayment(payload, repository) {
  validateInstallationPayment(payload);

  const institution = await repository.findInstitutionBillingProfile(Number(payload.institutionId));
  if (!institution) {
    throw new AppError('Institution not found', 404);
  }

  const paymentId = await repository.createInstallationPayment({
    institutionId: Number(payload.institutionId),
    amount: Number(payload.amount),
    paymentDate: payload.paymentDate,
    notes: payload.notes || 'Installation payment recorded',
  });

  return {
    paymentId,
    amount: Number(payload.amount),
  };
}

async function processReconnection(payload, repository) {
  validateReconnectionPayment(payload);

  const institution = await repository.findInstitutionBillingProfile(Number(payload.institutionId));
  if (!institution) {
    throw new AppError('Institution not found', 404);
  }

  const disconnection = await repository.findLatestOpenDisconnection(Number(payload.institutionId));
  if (!disconnection) {
    throw new AppError('No open disconnection record found for this institution.', 404);
  }

  const paymentId = await repository.createReconnectionPayment({
    institutionId: Number(payload.institutionId),
    amount: businessRules.fees.reconnection,
    paymentDate: payload.paymentDate,
    notes: payload.notes || 'Reconnection fee recorded',
  });

  await repository.markDisconnectionReconnected(disconnection.id, payload.paymentDate);
  await repository.updateInstitutionStatus(Number(payload.institutionId), 'Active');

  return {
    paymentId,
    amount: businessRules.fees.reconnection,
    institutionId: Number(payload.institutionId),
  };
}

async function getPaymentDashboard(repository) {
  const [institutions, payments, pendingCharges] = await Promise.all([
    repository.listInstitutions(),
    repository.getAllPayments(),
    repository.getPendingMonthlyCharges(),
  ]);

  return {
    institutions,
    payments,
    pendingCharges,
    installationFee: businessRules.fees.installation,
    reconnectionFee: businessRules.fees.reconnection,
    latePaymentRatePercent: businessRules.penalties.latePaymentRate * 100,
  };
}

module.exports = {
  generateMonthlyCharge,
  settleMonthlyCharge,
  recordInstallationPayment,
  processReconnection,
  getPaymentDashboard,
};
