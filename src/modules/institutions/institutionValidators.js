const validate = require('../../shared/validation/validate');
const {
  required,
  maxLength,
  isValidEmail,
  isValidKenyanPhone,
} = require('../../shared/validation/commonValidators');
const businessRules = require('../../config/businessRules');

function validateInstitutionRegistration(payload) {
  validate([
    {
      field: 'name',
      test: (value) => required(value) && maxLength(value, 100),
      message: 'Institution name is required and must not exceed 100 characters',
    },
    {
      field: 'postalAddress',
      test: (value) => !value || maxLength(value, 200),
      message: 'Postal address must not exceed 200 characters',
    },
    {
      field: 'town',
      test: (value) => required(value) && maxLength(value, 100),
      message: 'Town is required and must not exceed 100 characters',
    },
    {
      field: 'county',
      test: (value) => required(value) && maxLength(value, 100),
      message: 'County is required and must not exceed 100 characters',
    },
    {
      field: 'institutionType',
      test: (value) => businessRules.institutionTypes.includes(value),
      message: 'Institution type must be one of the allowed values',
    },
    {
      field: 'bandwidthPackageId',
      test: (value) => Number.isInteger(Number(value)) && Number(value) > 0,
      message: 'A valid bandwidth package is required',
    },
    {
      field: 'contactName',
      test: (value) => required(value) && maxLength(value, 100),
      message: 'Contact person name is required and must not exceed 100 characters',
    },
    {
      field: 'contactPhone',
      test: (value) => required(value) && isValidKenyanPhone(value),
      message: 'Invalid contact number format',
    },
    {
      field: 'contactEmail',
      test: (value) => isValidEmail(value),
      message: 'Invalid email address format',
    },
  ], payload);
}

module.exports = {
  validateInstitutionRegistration,
};
