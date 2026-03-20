const infrastructureService = require('../../src/modules/infrastructure/infrastructureService');

describe('infrastructureService', () => {
  test('saveInfrastructure calculates costs and creates a new record', async () => {
    const repository = {
      findInstitutionById: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Greenfield Academy',
      }),
      findTierForNodeCount: jest.fn().mockResolvedValue({
        id: 2,
        min_nodes: 11,
        max_nodes: 20,
        cost: 20000,
      }),
      findRecordByInstitutionId: jest.fn().mockResolvedValue(null),
      createRecord: jest.fn().mockResolvedValue(10),
      updateRecord: jest.fn(),
    };

    const result = await infrastructureService.saveInfrastructure({
      institutionId: 1,
      pcsPurchased: 2,
      lanNodes: 15,
      installationStatus: 'Completed',
      installationDate: '2024-03-10',
    }, repository);

    expect(result).toEqual({
      action: 'created',
      recordId: 10,
      pcsCost: 80000,
      lanCost: 20000,
      installationFee: 10000,
      totalCost: 110000,
    });
  });

  test('saveInfrastructure rejects invalid LAN node count of 1', async () => {
    const repository = {
      findInstitutionById: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Greenfield Academy',
      }),
    };

    await expect(infrastructureService.saveInfrastructure({
      institutionId: 1,
      pcsPurchased: 1,
      lanNodes: 1,
      installationStatus: 'Pending',
      installationDate: '2024-03-10',
    }, repository)).rejects.toMatchObject({
      message: 'LAN nodes must be either 0 or between 2 and 100.',
      statusCode: 400,
    });
  });
});
