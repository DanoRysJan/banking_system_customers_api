import { Test, TestingModule } from '@nestjs/testing';
import { UpdateEnterpriseHandler } from '../update-enterprise.handler';
import { IEnterpriseRepository } from '../../../../enterprise/domain/ports/repositories/repositories/enterprise.repository';
import { UpdateEnterpriseCommand } from '../../commands/update-enterprise.command';
import { Enterprise } from '../../../../enterprise/domain/models/enterprise.entity';
import { EntityNotFoundError } from '../../../../common/domain/exceptions/entity-not-found.error';
import { UpdateEnterpriseDto } from '@core/enterprise/shared/dto/update-enterprise.dto';

describe('UpdateEnterpriseHandler', () => {
  let handler: UpdateEnterpriseHandler;
  let enterpriseRepository: IEnterpriseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateEnterpriseHandler,
        {
          provide: 'IEnterpriseRepository',
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateEnterpriseHandler>(UpdateEnterpriseHandler);
    enterpriseRepository = module.get<IEnterpriseRepository>(
      'IEnterpriseRepository',
    );
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should update an enterprise when it exists', async () => {
    const enterpriseId = '1';
    const dto: UpdateEnterpriseDto = {
      taxIdNumber: 'Updated Enterprise',
    };
    const command = new UpdateEnterpriseCommand(enterpriseId, dto);
    const existingEnterprise = new Enterprise();
    jest
      .spyOn(enterpriseRepository, 'findById')
      .mockResolvedValue(existingEnterprise);
    jest
      .spyOn(enterpriseRepository, 'update')
      .mockResolvedValue(existingEnterprise);

    const result = await handler.execute(command);

    expect(result).toBe(existingEnterprise);
    expect(enterpriseRepository.findById).toHaveBeenCalledWith(enterpriseId);
    expect(enterpriseRepository.update).toHaveBeenCalledWith(enterpriseId, dto);
  });

  it('should throw EntityNotFoundError if the enterprise does not exist', async () => {
    const enterpriseId = '1';
    const dto: UpdateEnterpriseDto = {
      taxIdNumber: 'Updated Enterprise',
    };
    const command = new UpdateEnterpriseCommand(enterpriseId, dto);
    jest.spyOn(enterpriseRepository, 'findById').mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(EntityNotFoundError);
    await expect(handler.execute(command)).rejects.toThrowError(
      `Enterprise with ID ${enterpriseId} not found`,
    );
  });

  it('should rethrow other errors', async () => {
    const enterpriseId = '1';
    const dto: UpdateEnterpriseDto = {
      taxIdNumber: 'Updated Enterprise',
    };
    const command = new UpdateEnterpriseCommand(enterpriseId, dto);
    const error = new Error('Some other error');
    jest.spyOn(enterpriseRepository, 'findById').mockRejectedValue(error);

    await expect(handler.execute(command)).rejects.toThrow(error);
  });
});
