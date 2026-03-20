const AppError = require('../../shared/errors/AppError');
const businessRules = require('../../config/businessRules');
const { validateInfrastructurePayload } = require('./infrastructureValidators');

function calculateCosts(payload, lanTier) {
  const pcsCost = Number(payload.pcsPurchased) * businessRules.fees.pcUnit;
  const lanCost = lanTier ? Number(lanTier.cost) : 0;
  const installationFee = payload.installationStatus === 'Completed'
    ? businessRules.fees.installation
    : 0;
  const totalCost = pcsCost + lanCost + installationFee;

  return {
    pcsCost,
    lanCost,
    installationFee,
    totalCost,
  };
}

async function saveInfrastructure(payload, repository) {
  validateInfrastructurePayload(payload);

  const institutionId = Number(payload.institutionId);
  const pcsPurchased = Number(payload.pcsPurchased);
  const lanNodes = Number(payload.lanNodes);

  const institution = await repository.findInstitutionById(institutionId);
  if (!institution) {
    throw new AppError('Institution not found', 404);
  }

  if (pcsPurchased === 0 && lanNodes === 0) {
    throw new AppError('At least one infrastructure quantity must be provided.', 400);
  }

  if (lanNodes === 1) {
    throw new AppError('LAN nodes must be either 0 or between 2 and 100.', 400);
  }

  let lanTier = null;
  if (lanNodes > 0) {
    lanTier = await repository.findTierForNodeCount(lanNodes);
    if (!lanTier) {
      throw new AppError('LAN node count must be between 2 and 100.', 400);
    }
  }

  const costs = calculateCosts(payload, lanTier);
  const existingRecord = await repository.findRecordByInstitutionId(institutionId);

  const savePayload = {
    institutionId,
    pcsPurchased,
    lanNodes,
    installationStatus: payload.installationStatus,
    installationDate: payload.installationDate || null,
    ...costs,
  };

  if (existingRecord) {
    await repository.updateRecord(existingRecord.id, savePayload);
    return {
      action: 'updated',
      recordId: existingRecord.id,
      ...costs,
    };
  }

  const recordId = await repository.createRecord(savePayload);
  return {
    action: 'created',
    recordId,
    ...costs,
  };
}

async function getInfrastructureDashboard(repository) {
  const [institutions, records, lanPricingTiers] = await Promise.all([
    repository.listInstitutions(),
    repository.getAllRecords(),
    repository.getLanPricingTiers(),
  ]);

  return {
    institutions,
    records,
    lanPricingTiers,
    pcUnitCost: businessRules.fees.pcUnit,
    installationFee: businessRules.fees.installation,
  };
}

module.exports = {
  saveInfrastructure,
  getInfrastructureDashboard,
};
