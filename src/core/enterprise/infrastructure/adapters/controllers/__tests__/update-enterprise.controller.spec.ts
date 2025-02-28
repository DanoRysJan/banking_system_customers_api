import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateEnterpriseCommand } from '../../../../..//enterprise/application/commands/update-enterprise.command';
import { UpdateEnterpriseDto } from '../../../../..//enterprise/shared/dto/update-enterprise.dto';
import { Enterprise } from '../../../../..//enterprise/domain/models/enterprise.entity';
import { UpdateEnterpriseController } from '../update.controller';

describe('UpdateEnterpriseController', () => {
  let controller: UpdateEnterpriseController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateEnterpriseController],
      providers: [CommandBus],
    }).compile();

    controller = module.get<UpdateEnterpriseController>(
      UpdateEnterpriseController,
    );
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should call commandBus.execute with UpdateEnterpriseCommand', async () => {
      const commandBusExecuteSpy = jest
        .spyOn(commandBus, 'execute')
        .mockResolvedValue(new Enterprise());

      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto: UpdateEnterpriseDto = {
        legalBusinessName: 'New Enterprise Name',
      };

      const result = await controller.update(id, dto);

      expect(commandBusExecuteSpy).toHaveBeenCalledWith(
        new UpdateEnterpriseCommand(id, dto),
      );
      expect(result).toBeInstanceOf(Enterprise);
    });

    it('should handle errors thrown by commandBus.execute', async () => {
      jest
        .spyOn(commandBus, 'execute')
        .mockRejectedValue(new Error('Command failed'));

      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto: UpdateEnterpriseDto = {
        legalBusinessName: 'New Enterprise Name',
      };

      await expect(controller.update(id, dto)).rejects.toThrow(
        'Command failed',
      );
    });
  });
});
