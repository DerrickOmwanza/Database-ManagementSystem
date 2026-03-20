const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KENYAN_PHONE_REGEX = /^(?:\+254|0)(7\d{8}|1\d{8})$/;

function required(value) {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return true;
}

function maxLength(value, limit) {
  return typeof value === 'string' && value.trim().length <= limit;
}

function isValidEmail(value) {
  return !value || EMAIL_REGEX.test(value.trim());
}

function isValidKenyanPhone(value) {
  return typeof value === 'string' && KENYAN_PHONE_REGEX.test(value.trim());
}

function isPositiveNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0;
}

function isNonNegativeInteger(value) {
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric >= 0;
}

function isNotFutureDate(value) {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
}

module.exports = {
  required,
  maxLength,
  isValidEmail,
  isValidKenyanPhone,
  isPositiveNumber,
  isNonNegativeInteger,
  isNotFutureDate,
};
