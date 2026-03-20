const asyncHandler = require('../../shared/utils/asyncHandler');
const institutionRepository = require('./institutionRepository');
const institutionService = require('./institutionService');

const list = asyncHandler(async (req, res) => {
  const institutions = await institutionService.listInstitutions(institutionRepository);

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(200).json({ institutions });
  }

  return res.render('institutions/index', {
    title: 'Registered Institutions',
    pageHeading: 'Registered Institutions',
    pageDescription: 'View all institution records, contact details, and active package assignments.',
    institutions,
  });
});

const showCreate = asyncHandler(async (req, res) => {
  const formData = await institutionService.listRegistrationFormData(institutionRepository);

  return res.render('institutions/create', {
    title: 'Register Institution',
    pageHeading: 'Register New Institution',
    pageDescription: 'Capture institution details, contact information, and the assigned bandwidth package.',
    ...formData,
  });
});

const create = asyncHandler(async (req, res) => {
  const result = await institutionService.registerInstitution(req.body, institutionRepository);

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(201).json({
      message: 'Institution registered successfully',
      ...result,
    });
  }

  req.flash(
    'success',
    `Institution registered successfully. Registration fee recorded: KSh ${result.registrationFee.toLocaleString()}`
  );
  return res.redirect('/institutions');
});

module.exports = {
  list,
  showCreate,
  create,
};
