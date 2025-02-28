import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteEnterpriseCommand } from '../../../../../enterprise/application/commands/delete-enterprise.command';
import { AppResponse } from '../../../../../common/infrastructure/models/api.response';
import { DeleteEnterpriseController } from '../delete.controller';

describe('DeleteEnterpriseController', () => {
  let controller: DeleteEnterpriseController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteEnterpriseController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<DeleteEnterpriseController>(
      DeleteEnterpriseController,
    );
    commandBus = module.get<CommandBus>(CommandBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should execute DeleteEnterpriseCommand and return AppResponse', async () => {
    const id = 'enterprise-123';
    const expectedResponse: AppResponse<null> = {
      status: 204,
      message: 'Enterprise deleted successfully',
    };
    jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResponse);

    const result = await controller.delete(id);

    expect(commandBus.execute).toHaveBeenCalledWith(
      new DeleteEnterpriseCommand(id),
    );
    expect(result).toBe(expectedResponse);
  });
});
