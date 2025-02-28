import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { AddPartyToEnterpriseCommand } from '../../../../../enterprise/application/commands/add-party.command';
import { AddPartyToEnterpriseDto } from '../../../../../enterprise/shared/dto/add-party.dto';
import { AddPartyToEnterpriseController } from '../add-party.controller';
import { RoleType } from '../../../../..//party/domain/models/party.entity';

describe('AddPartyToEnterpriseController', () => {
  let controller: AddPartyToEnterpriseController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddPartyToEnterpriseController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AddPartyToEnterpriseController>(
      AddPartyToEnterpriseController,
    );
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should execute AddPartyToEnterpriseCommand with correct parameters', async () => {
    const dto: AddPartyToEnterpriseDto = {
      userId: 'user-123',
      role: RoleType.ADMIN,
    };
    const enterpriseId = 'enterprise-123';
    jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);

    await controller.addPartyToEnterprise(enterpriseId, dto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new AddPartyToEnterpriseCommand(enterpriseId, dto.userId, dto.role),
    );
  });
});
