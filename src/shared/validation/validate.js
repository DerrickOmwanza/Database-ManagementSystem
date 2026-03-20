const AppError = require('../errors/AppError');

function validate(rules, payload) {
  const errors = [];

  for (const rule of rules) {
    const value = payload[rule.field];
    const isValid = rule.test(value, payload);

    if (!isValid) {
      errors.push({
        field: rule.field,
        message: rule.message,
      });
    }
  }

  if (errors.length > 0) {
    throw new AppError('Validation failed', 400, errors);
  }
}

module.exports = validate;
