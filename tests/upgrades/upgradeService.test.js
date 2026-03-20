const upgradeService = require('../../src/modules/upgrades/upgradeService');

describe('upgradeService', () => {
  test('createUpgrade rejects same bandwidth selection', async () => {
    const repository = {
      findInstitutionWithPackage: jest.fn().mockResolvedValue({
        id: 1,
        bandwidth_package_id: 2,
        monthly_cost: 2000,
      }),
      findBandwidthPackage: jest.fn().mockResolvedValue({
        id: 2,
        monthly_cost: 2000,
      }),
      createUpgradeAndUpdateInstitution: jest.fn(),
    };

    await expect(upgradeService.createUpgrade({
      institutionId: 1,
      newPackageId: 2,
      upgradeDate: '2024-03-10',
    }, repository)).rejects.toMatchObject({
      message: 'New bandwidth must be different from current bandwidth.',
      statusCode: 400,
    });
  });

  test('createUpgrade rejects downgrade attempt', async () => {
    const repository = {
      findInstitutionWithPackage: jest.fn().mockResolvedValue({
        id: 1,
        bandwidth_package_id: 3,
        monthly_cost: 3500,
      }),
      findBandwidthPackage: jest.fn().mockResolvedValue({
        id: 2,
        monthly_cost: 2000,
      }),
      createUpgradeAndUpdateInstitution: jest.fn(),
    };

    await expect(upgradeService.createUpgrade({
      institutionId: 1,
      newPackageId: 2,
      upgradeDate: '2024-03-10',
    }, repository)).rejects.toMatchObject({
      message: 'Downgrade is not permitted. Please select a higher bandwidth tier.',
      statusCode: 400,
    });
  });

  test('createUpgrade applies 10 percent discount to new package', async () => {
    const repository = {
      findInstitutionWithPackage: jest.fn().mockResolvedValue({
        id: 1,
        bandwidth_package_id: 2,
        monthly_cost: 2000,
      }),
      findBandwidthPackage: jest.fn().mockResolvedValue({
        id: 3,
        monthly_cost: 3500,
      }),
      createUpgradeAndUpdateInstitution: jest.fn().mockResolvedValue(8),
    };

    const result = await upgradeService.createUpgrade({
      institutionId: 1,
      newPackageId: 3,
      upgradeDate: '2024-03-10',
    }, repository);

    expect(result).toEqual({
      upgradeId: 8,
      institutionId: 1,
      oldMonthlyCost: 2000,
      newMonthlyCost: 3500,
      discountedMonthlyCost: 3150,
      discountPercent: 10,
    });
  });
});
