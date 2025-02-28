import { Test, TestingModule } from '@nestjs/testing';
import { GetEnterpriseByIdHandler } from '../get-enterprise.handler';
import { IEnterpriseRepository } from '../../../../enterprise/domain/ports/repositories/repositories/enterprise.repository';
import { GetEnterpriseByIdQuery } from '../../queries/get-enterprise-by-id.query';
import { EntityNotFoundError } from '../../../../common/domain/exceptions/entity-not-found.error';
import { Enterprise } from '../../../../enterprise/domain/models/enterprise.entity';

describe('GetEnterpriseByIdHandler', () => {
  let handler: GetEnterpriseByIdHandler;
  let enterpriseRepository: IEnterpriseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetEnterpriseByIdHandler,
        {
          provide: 'IEnterpriseRepository',
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetEnterpriseByIdHandler>(GetEnterpriseByIdHandler);
    enterpriseRepository = module.get<IEnterpriseRepository>(
      'IEnterpriseRepository',
    );
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return an enterprise when it exists', async () => {
    const enterpriseId = '1';
    const query = new GetEnterpriseByIdQuery(enterpriseId);
    const enterprise = new Enterprise(); // Puedes personalizar según la estructura real de la entidad
    jest.spyOn(enterpriseRepository, 'findById').mockResolvedValue(enterprise);

    const result = await handler.execute(query);

    expect(result).toBe(enterprise);
    expect(enterpriseRepository.findById).toHaveBeenCalledWith(enterpriseId);
  });

  it('should throw EntityNotFoundError if enterprise is not found', async () => {
    const enterpriseId = '1';
    const query = new GetEnterpriseByIdQuery(enterpriseId);
    jest.spyOn(enterpriseRepository, 'findById').mockResolvedValue(null);

    await expect(handler.execute(query)).rejects.toThrow(EntityNotFoundError);
    await expect(handler.execute(query)).rejects.toThrowError(
      `Enterprise with ID ${enterpriseId} not found`,
    );
  });

  it('should rethrow other errors', async () => {
    const enterpriseId = '1';
    const query = new GetEnterpriseByIdQuery(enterpriseId);
    const error = new Error('Some other error');
    jest.spyOn(enterpriseRepository, 'findById').mockRejectedValue(error);

    await expect(handler.execute(query)).rejects.toThrow(error);
  });
});
