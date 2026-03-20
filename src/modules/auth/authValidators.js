const validate = require('../../shared/validation/validate');
const { required, maxLength } = require('../../shared/validation/commonValidators');

function validateLogin(payload) {
  validate([
    {
      field: 'username',
      test: (value) => required(value) && maxLength(value, 50),
      message: 'Username is required and must not exceed 50 characters',
    },
    {
      field: 'password',
      test: (value) => required(value) && maxLength(value, 255),
      message: 'Password is required and must not exceed 255 characters',
    },
  ], payload);
}

module.exports = {
  validateLogin,
};
