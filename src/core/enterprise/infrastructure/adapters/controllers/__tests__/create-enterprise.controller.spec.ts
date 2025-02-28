import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { CreateEnterpriseCommand } from '../../../../../enterprise/application/commands/create-enterprise.command';
import { CreateEnterpriseDto } from '../../../../../enterprise/shared/dto/create-enterprise.dto';
import {
  Enterprise,
  EnterpriseType,
} from '../../../../../enterprise/domain/models/enterprise.entity';
import { CreateEnterpriseController } from '../create.controller';

describe('CreateEnterpriseController', () => {
  let controller: CreateEnterpriseController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateEnterpriseController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<CreateEnterpriseController>(
      CreateEnterpriseController,
    );
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should execute CreateEnterpriseCommand with correct parameters', async () => {
    const dto: CreateEnterpriseDto = {
      type: EnterpriseType.COMPANY,
      legalBusinessName: 'Acme Corp',
      taxIdNumber: '12345619',
      email: 'contact@acmecorp.com',
      phone: '1234567890',
      userId: 'userid',
    };
    const user = { id: 'user-123' };
    const expectedResponse = new Enterprise();
    jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResponse);

    const result = await controller.create(user, dto);

    expect(dto.userId).toBe(user.id);
    expect(commandBus.execute).toHaveBeenCalledWith(
      new CreateEnterpriseCommand(dto),
    );
    expect(result).toBe(expectedResponse);
  });
});
