const AppError = require('../../shared/errors/AppError');
const businessRules = require('../../config/businessRules');
const { validateInstitutionRegistration } = require('./institutionValidators');

async function registerInstitution(payload, repository) {
  validateInstitutionRegistration(payload);

  const duplicate = await repository.findByNameAndTown(payload.name, payload.town);
  if (duplicate) {
    throw new AppError('Institution already exists in the system.', 409);
  }

  const institutionId = await repository.createInstitutionRegistration(
    {
      ...payload,
      bandwidthPackageId: Number(payload.bandwidthPackageId),
    },
    businessRules.fees.registration
  );

  return {
    institutionId,
    registrationFee: businessRules.fees.registration,
  };
}

async function listInstitutions(repository) {
  return repository.getAll();
}

async function listRegistrationFormData(repository) {
  const bandwidthPackages = await repository.listBandwidthPackages();

  return {
    bandwidthPackages,
    institutionTypes: businessRules.institutionTypes,
    registrationFee: businessRules.fees.registration,
  };
}

module.exports = {
  registerInstitution,
  listInstitutions,
  listRegistrationFormData,
};
