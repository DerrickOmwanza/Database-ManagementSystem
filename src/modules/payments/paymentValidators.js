const validate = require('../../shared/validation/validate');
const {
  required,
  isPositiveNumber,
  isNotFutureDate,
} = require('../../shared/validation/commonValidators');

function isValidMonth(value) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric >= 1 && numeric <= 12;
}

function isValidYear(value) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric >= 2020 && numeric <= 2100;
}

function isValidId(value) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric > 0;
}

function validateMonthlyChargeGeneration(payload) {
  validate([
    {
      field: 'institutionId',
      test: isValidId,
      message: 'A valid institution is required',
    },
    {
      field: 'billingMonth',
      test: isValidMonth,
      message: 'Billing month must be between 1 and 12',
    },
    {
      field: 'billingYear',
      test: isValidYear,
      message: 'Billing year must be valid',
    },
  ], payload);
}

function validateChargeSettlement(payload) {
  validate([
    {
      field: 'paymentId',
      test: isValidId,
      message: 'A valid payment is required',
    },
    {
      field: 'paymentDate',
      test: (value) => required(value) && isNotFutureDate(value),
      message: 'Payment date cannot be in the future',
    },
  ], payload);
}

function validateInstallationPayment(payload) {
  validate([
    {
      field: 'institutionId',
      test: isValidId,
      message: 'A valid institution is required',
    },
    {
      field: 'paymentDate',
      test: (value) => required(value) && isNotFutureDate(value),
      message: 'Payment date cannot be in the future',
    },
    {
      field: 'amount',
      test: isPositiveNumber,
      message: 'Invalid payment amount. Amount must be greater than zero.',
    },
  ], payload);
}

function validateReconnectionPayment(payload) {
  validate([
    {
      field: 'institutionId',
      test: isValidId,
      message: 'A valid institution is required',
    },
    {
      field: 'paymentDate',
      test: (value) => required(value) && isNotFutureDate(value),
      message: 'Payment date cannot be in the future',
    },
  ], payload);
}

module.exports = {
  validateMonthlyChargeGeneration,
  validateChargeSettlement,
  validateInstallationPayment,
  validateReconnectionPayment,
};
