import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../../../auth/application/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../auth/application/guards/roles.guard';
import { GetUserQuery } from '../../../../../user/application/queries/get-user.query';
import { User } from '../../../../../user/domain/models/user.entity';
import { Reflector } from '@nestjs/core';
import { UserController } from '../get.controller';

describe('UserController', () => {
  let controller: UserController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        QueryBus,
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: RolesGuard,
          useValue: {
            canActivate: jest.fn().mockResolvedValue(true),
          },
        },
        Reflector, // Necesario para el guard de roles
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should return a user if found', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const user = new User();
      user.id = userId;
      user.fullName = 'John Doe';

      jest.spyOn(queryBus, 'execute').mockResolvedValue(user);

      const result = await controller.getUser(userId);
      expect(result).toEqual(user);
      expect(queryBus.execute).toHaveBeenCalledWith(new GetUserQuery(userId));
    });

    it('should throw an error if user is not found', async () => {
      const userId = 'non-existent-id';
      jest.spyOn(queryBus, 'execute').mockResolvedValue(null);

      await expect(controller.getUser(userId)).resolves.toBeNull();
    });
  });
});
