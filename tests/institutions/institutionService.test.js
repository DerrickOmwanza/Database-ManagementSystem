const institutionService = require('../../src/modules/institutions/institutionService');

describe('institutionService', () => {
  test('registerInstitution rejects duplicates', async () => {
    const repository = {
      findByNameAndTown: jest.fn().mockResolvedValue({ id: 99 }),
      createInstitutionRegistration: jest.fn(),
    };

    await expect(institutionService.registerInstitution({
      name: 'Greenfield Academy',
      town: 'Nakuru',
      county: 'Nakuru',
      institutionType: 'Senior',
      bandwidthPackageId: 2,
      contactName: 'John Doe',
      contactPhone: '0712345678',
      contactEmail: 'info@greenfield.ac.ke',
    }, repository)).rejects.toMatchObject({
      message: 'Institution already exists in the system.',
      statusCode: 409,
    });
  });

  test('registerInstitution creates institution and returns registration fee', async () => {
    const repository = {
      findByNameAndTown: jest.fn().mockResolvedValue(null),
      createInstitutionRegistration: jest.fn().mockResolvedValue(10),
    };

    const result = await institutionService.registerInstitution({
      name: 'Greenfield Academy',
      postalAddress: 'P.O. Box 10',
      town: 'Nakuru',
      county: 'Nakuru',
      institutionType: 'Senior',
      bandwidthPackageId: '2',
      contactName: 'John Doe',
      contactPhone: '0712345678',
      contactEmail: 'info@greenfield.ac.ke',
    }, repository);

    expect(result).toEqual({
      institutionId: 10,
      registrationFee: 8500,
    });
    expect(repository.createInstitutionRegistration).toHaveBeenCalled();
  });
});
