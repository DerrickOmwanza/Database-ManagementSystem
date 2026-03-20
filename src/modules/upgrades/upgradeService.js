const AppError = require('../../shared/errors/AppError');
const businessRules = require('../../config/businessRules');
const { toDateString } = require('../../shared/utils/dateUtils');
const { validateUpgradeRequest } = require('./upgradeValidators');

async function createUpgrade(payload, repository) {
  validateUpgradeRequest(payload);

  const institution = await repository.findInstitutionWithPackage(Number(payload.institutionId));
  if (!institution) {
    throw new AppError('Institution not found', 404);
  }

  const newPackage = await repository.findBandwidthPackage(Number(payload.newPackageId));
  if (!newPackage) {
    throw new AppError('Bandwidth package not found', 404);
  }

  if (Number(newPackage.id) === Number(institution.bandwidth_package_id)) {
    throw new AppError('New bandwidth must be different from current bandwidth.', 400);
  }

  const oldMonthlyCost = Number(institution.monthly_cost);
  const newMonthlyCost = Number(newPackage.monthly_cost);

  if (newMonthlyCost < oldMonthlyCost) {
    throw new AppError('Downgrade is not permitted. Please select a higher bandwidth tier.', 400);
  }

  const discountedMonthlyCost = Number(
    (newMonthlyCost * (1 - businessRules.discounts.upgrade)).toFixed(2)
  );

  const upgradeId = await repository.createUpgradeAndUpdateInstitution({
    institutionId: Number(payload.institutionId),
    oldPackageId: Number(institution.bandwidth_package_id),
    newPackageId: Number(newPackage.id),
    oldMonthlyCost,
    newMonthlyCost,
    discountPercent: businessRules.discounts.upgrade * 100,
    discountedMonthlyCost,
    upgradeDate: payload.upgradeDate || toDateString(new Date()),
  });

  return {
    upgradeId,
    institutionId: Number(payload.institutionId),
    oldMonthlyCost,
    newMonthlyCost,
    discountedMonthlyCost,
    discountPercent: businessRules.discounts.upgrade * 100,
  };
}

async function getUpgradeDashboard(repository) {
  const [institutions, bandwidthPackages, upgrades] = await Promise.all([
    repository.listInstitutions(),
    repository.listBandwidthPackages(),
    repository.getAllUpgrades(),
  ]);

  return {
    institutions,
    bandwidthPackages,
    upgrades,
    discountPercent: businessRules.discounts.upgrade * 100,
  };
}

module.exports = {
  createUpgrade,
  getUpgradeDashboard,
};
