import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from '../../../../common/domain/exceptions/entity-not-found.error';
import { GetUserHandler } from '../get-user.handler';
import { IUserRepository } from '../../../../user/domain/ports/repositories/user.repository';
import { User } from '../../../../user/domain/models/user.entity';
import { GetUserQuery } from '../../queries/get-user.query';

describe('GetUserHandler', () => {
  let handler: GetUserHandler;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const mockUserRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserHandler,
        { provide: 'IUserRepository', useValue: mockUserRepository },
      ],
    }).compile();

    handler = module.get<GetUserHandler>(GetUserHandler);
    userRepository = module.get<IUserRepository>('IUserRepository');
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return a user when found', async () => {
    const user = new User();
    user.id = 'user-id';

    jest.spyOn(userRepository, 'findById').mockResolvedValue(user);

    const result = await handler.execute(new GetUserQuery('user-id'));

    expect(result).toEqual(user);
    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
  });

  it('should throw EntityNotFoundError when user is not found', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

    await expect(handler.execute(new GetUserQuery('user-id'))).rejects.toThrow(
      EntityNotFoundError,
    );
    expect(userRepository.findById).toHaveBeenCalledWith('user-id');
  });
});
