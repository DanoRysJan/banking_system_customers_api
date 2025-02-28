import { Test, TestingModule } from '@nestjs/testing';
import { IEnterpriseRepository } from '../../../../enterprise/domain/ports/repositories/repositories/enterprise.repository';
import { GetAllEnterprisesQuery } from '../../queries/get-enterprises.query';
import {
  Enterprise,
  EnterpriseType,
} from '../../../../enterprise/domain/models/enterprise.entity';
import { GetAllEnterprisesHandler } from '../get-enterprises.handler';

describe('GetAllEnterprisesHandler', () => {
  let handler: GetAllEnterprisesHandler;
  let enterpriseRepository: IEnterpriseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllEnterprisesHandler,
        {
          provide: 'IEnterpriseRepository',
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetAllEnterprisesHandler>(GetAllEnterprisesHandler);
    enterpriseRepository = module.get<IEnterpriseRepository>(
      'IEnterpriseRepository',
    );
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return a list of enterprises', async () => {
    const page = 1;
    const limit = 10;
    const type: EnterpriseType = EnterpriseType.COMPANY;
    const query = new GetAllEnterprisesQuery(page, limit, type);
    const enterprises = [new Enterprise(), new Enterprise()];
    const total = 2;
    jest
      .spyOn(enterpriseRepository, 'findAll')
      .mockResolvedValue({ data: enterprises, total });

    const result = await handler.execute(query);

    expect(result).toEqual({ data: enterprises, total, page, limit });
    expect(enterpriseRepository.findAll).toHaveBeenCalledWith(
      page,
      limit,
      type,
    );
  });

  it('should handle an empty result when no enterprises are found', async () => {
    const page = 1;
    const limit = 10;
    const type: EnterpriseType = EnterpriseType.COMPANY;
    const query = new GetAllEnterprisesQuery(page, limit, type);
    const enterprises: Enterprise[] = [];
    const total = 0;
    jest
      .spyOn(enterpriseRepository, 'findAll')
      .mockResolvedValue({ data: enterprises, total });

    const result = await handler.execute(query);

    expect(result).toEqual({ data: enterprises, total, page, limit });
    expect(enterpriseRepository.findAll).toHaveBeenCalledWith(
      page,
      limit,
      type,
    );
  });

  it('should rethrow other errors', async () => {
    const page = 1;
    const limit = 10;
    const type: EnterpriseType = EnterpriseType.COMPANY;
    const query = new GetAllEnterprisesQuery(page, limit, type);
    const error = new Error('Some other error');
    jest.spyOn(enterpriseRepository, 'findAll').mockRejectedValue(error);

    await expect(handler.execute(query)).rejects.toThrow(error);
  });
});
