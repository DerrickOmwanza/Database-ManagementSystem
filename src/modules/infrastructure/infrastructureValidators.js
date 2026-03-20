const validate = require('../../shared/validation/validate');
const {
  required,
  isNonNegativeInteger,
  isNotFutureDate,
} = require('../../shared/validation/commonValidators');
const businessRules = require('../../config/businessRules');

function isValidId(value) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric > 0;
}

function validateInfrastructurePayload(payload) {
  validate([
    {
      field: 'institutionId',
      test: isValidId,
      message: 'A valid institution is required',
    },
    {
      field: 'pcsPurchased',
      test: isNonNegativeInteger,
      message: 'PC quantity must be zero or a positive integer',
    },
    {
      field: 'lanNodes',
      test: isNonNegativeInteger,
      message: 'LAN nodes must be zero or a positive integer',
    },
    {
      field: 'installationStatus',
      test: (value) => businessRules.installationStatuses.includes(value),
      message: 'Installation status must be one of the allowed values',
    },
    {
      field: 'installationDate',
      test: (value, fullPayload) => {
        if (!value) {
          return true;
        }

        if (!required(fullPayload.installationStatus)) {
          return false;
        }

        return isNotFutureDate(value);
      },
      message: 'Installation date cannot be in the future',
    },
  ], payload);
}

module.exports = {
  validateInfrastructurePayload,
};
