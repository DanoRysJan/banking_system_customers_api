import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePartyController } from '../update-party.controller';
import { UpdatePartyCommand } from '../../../../..//enterprise/application/commands/update-party.command';
import { UpdatePartyDto } from '../../../../..//enterprise/shared/dto/update-party.dto';
import { RoleType } from '../../../../..//party/domain/models/party.entity';

describe('UpdatePartyController', () => {
  let controller: UpdatePartyController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdatePartyController],
      providers: [CommandBus],
    }).compile();

    controller = module.get<UpdatePartyController>(UpdatePartyController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateParty', () => {
    it('should call commandBus.execute with UpdatePartyCommand', async () => {
      const commandBusExecuteSpy = jest
        .spyOn(commandBus, 'execute')
        .mockResolvedValue('Party role updated');

      const enterpriseId = 'a123e4567-e89b-12d3-a456-426614174000';
      const partyId = 'f6556b8-3857-4ab8-acee-8d569b587007';
      const dto: UpdatePartyDto = { role: RoleType.ADMIN };

      const result = await controller.updateParty(enterpriseId, partyId, dto);

      expect(commandBusExecuteSpy).toHaveBeenCalledWith(
        new UpdatePartyCommand(enterpriseId, partyId, dto.role),
      );
      expect(result).toBe('Party role updated');
    });

    it('should handle errors thrown by commandBus.execute', async () => {
      jest
        .spyOn(commandBus, 'execute')
        .mockRejectedValue(new Error('Command failed'));

      const enterpriseId = 'a123e4567-e89b-12d3-a456-426614174000';
      const partyId = 'f6556b8-3857-4ab8-acee-8d569b587007';
      const dto: UpdatePartyDto = { role: RoleType.ADMIN };

      await expect(
        controller.updateParty(enterpriseId, partyId, dto),
      ).rejects.toThrow('Command failed');
    });
  });
});
