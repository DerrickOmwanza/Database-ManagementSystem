const asyncHandler = require('../../shared/utils/asyncHandler');
const infrastructureRepository = require('./infrastructureRepository');
const infrastructureService = require('./infrastructureService');

const index = asyncHandler(async (req, res) => {
  const data = await infrastructureService.getInfrastructureDashboard(infrastructureRepository);

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(200).json(data);
  }

  return res.render('infrastructure/index', {
    title: 'Infrastructure',
    pageHeading: 'Infrastructure Management',
    pageDescription: 'Track PCs, LAN nodes, installation progress, and the total deployment cost per institution.',
    ...data,
  });
});

const save = asyncHandler(async (req, res) => {
  const result = await infrastructureService.saveInfrastructure(req.body, infrastructureRepository);

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(result.action === 'created' ? 201 : 200).json({
      message: 'Infrastructure saved successfully',
      ...result,
    });
  }

  req.flash('success', 'Infrastructure saved successfully');
  return res.redirect('/infrastructure');
});

module.exports = {
  index,
  save,
};
