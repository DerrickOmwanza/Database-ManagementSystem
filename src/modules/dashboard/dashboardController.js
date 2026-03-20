const asyncHandler = require('../../shared/utils/asyncHandler');
const dashboardRepository = require('./dashboardRepository');
const dashboardService = require('./dashboardService');

const index = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardData(dashboardRepository);

  return res.render('dashboard/index', {
    title: 'Dashboard',
    pageHeading: 'System Dashboard',
    pageDescription: 'Overview of institutions, billing, and recent system activity.',
    ...data,
  });
});

module.exports = {
  index,
};
