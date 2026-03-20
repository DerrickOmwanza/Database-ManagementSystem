const asyncHandler = require('../../shared/utils/asyncHandler');
const upgradeRepository = require('./upgradeRepository');
const upgradeService = require('./upgradeService');

const index = asyncHandler(async (req, res) => {
  const data = await upgradeService.getUpgradeDashboard(upgradeRepository);

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(200).json(data);
  }

  return res.render('upgrades/index', {
    title: 'Bandwidth Upgrades',
    pageHeading: 'Bandwidth Upgrades',
    pageDescription: 'Process service upgrades and apply the documented 10% discounted monthly rate.',
    ...data,
  });
});

const create = asyncHandler(async (req, res) => {
  const result = await upgradeService.createUpgrade(req.body, upgradeRepository);

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(201).json({
      message: 'Bandwidth upgrade processed successfully',
      ...result,
    });
  }

  req.flash('success', 'Bandwidth upgrade processed successfully');
  return res.redirect('/upgrades');
});

module.exports = {
  index,
  create,
};
