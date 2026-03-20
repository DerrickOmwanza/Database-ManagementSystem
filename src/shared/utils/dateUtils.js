function toDateString(date) {
  return date.toISOString().slice(0, 10);
}

function getLastDayOfMonth(year, month) {
  return new Date(Date.UTC(year, month, 0));
}

function getDisconnectionDeadline(year, month) {
  return new Date(Date.UTC(year, month, 10));
}

function isAfterDate(left, right) {
  return new Date(left).getTime() > new Date(right).getTime();
}

module.exports = {
  toDateString,
  getLastDayOfMonth,
  getDisconnectionDeadline,
  isAfterDate,
};
