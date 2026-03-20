const validate = require('../../shared/validation/validate');
const { required, isNotFutureDate } = require('../../shared/validation/commonValidators');

function isValidId(value) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric > 0;
}

function validateUpgradeRequest(payload) {
  validate([
    {
      field: 'institutionId',
      test: isValidId,
      message: 'A valid institution is required',
    },
    {
      field: 'newPackageId',
      test: isValidId,
      message: 'A valid new bandwidth package is required',
    },
    {
      field: 'upgradeDate',
      test: (value) => !value || (required(value) && isNotFutureDate(value)),
      message: 'Upgrade date cannot be in the future',
    },
  ], payload);
}

module.exports = {
  validateUpgradeRequest,
};
