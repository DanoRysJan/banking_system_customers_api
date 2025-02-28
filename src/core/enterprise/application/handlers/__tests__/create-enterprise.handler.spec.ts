import { Test, TestingModule } from '@nestjs/testing';
import { CreateEnterpriseHandler } from '../create-enterprise.handler';
import { IEnterpriseRepository } from '../../../../enterprise/domain/ports/repositories/repositories/enterprise.repository';
import { CreateEnterpriseCommand } from '../../commands/create-enterprise.command';
import { Enterprise } from '../../../../enterprise/domain/models/enterprise.entity';
import { mockCreateEnterpriseDto } from '../../../../../../test/mocks/dtos/create-enterprise.dto.mock';

describe('CreateEnterpriseHandler', () => {
  let handler: CreateEnterpriseHandler;
  let enterpriseRepository: IEnterpriseRepository;

  const dto = mockCreateEnterpriseDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateEnterpriseHandler,
        {
          provide: 'IEnterpriseRepository',
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateEnterpriseHandler>(CreateEnterpriseHandler);
    enterpriseRepository = module.get<IEnterpriseRepository>(
      'IEnterpriseRepository',
    );
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should create an enterprise successfully', async () => {
    const command = new CreateEnterpriseCommand(dto);
    const createdEnterprise = new Enterprise(); // Crea un mock de la entidad Enterprise
    jest
      .spyOn(enterpriseRepository, 'create')
      .mockResolvedValue(createdEnterprise);

    const result = await handler.execute(command);

    expect(result).toBe(createdEnterprise);
    expect(enterpriseRepository.create).toHaveBeenCalledWith(dto);
  });

  it('should rethrow other errors', async () => {
    const dto = mockCreateEnterpriseDto;
    const command = new CreateEnterpriseCommand(dto);
    const error = new Error('Some other error');
    jest.spyOn(enterpriseRepository, 'create').mockRejectedValue(error);

    await expect(handler.execute(command)).rejects.toThrow(error);
  });
});
