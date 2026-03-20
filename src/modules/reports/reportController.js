const asyncHandler = require('../../shared/utils/asyncHandler');
const reportRepository = require('./reportRepository');
const reportService = require('./reportService');

const index = asyncHandler(async (req, res) => {
  const data = await reportService.getReportsDashboard(reportRepository);

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(200).json(data);
  }

  return res.render('reports/index', {
    title: 'Reports',
    pageHeading: 'Operational Reports',
    pageDescription: 'Review registration, payment, disconnection, infrastructure, and upgrade summaries.',
    ...data,
  });
});

module.exports = {
  index,
};
