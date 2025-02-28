import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserHandler } from '../register-user.handler';
import { RegisterUserCommand } from '../../commands/register-user.command';
import { AuthService } from '../../../../auth/domain/services/auth.service';
import { mockUser as mockUserEntity } from '../../../../../../test/mocks/entities/user.entity.mock';

describe('RegisterUserHandler', () => {
  let handler: RegisterUserHandler;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserHandler,
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<RegisterUserHandler>(RegisterUserHandler);
    authService = module.get<AuthService>(AuthService);
  });

  it('should register a new user', async () => {
    const mockUser = mockUserEntity;

    jest.spyOn(authService, 'register').mockResolvedValue(mockUser);

    const command = new RegisterUserCommand({
      fullName: 'New User',
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'securePass123',
      phone: '1234567890',
    });

    const result = await handler.execute(command);

    expect(authService.register).toHaveBeenCalledWith({
      fullName: 'New User',
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'securePass123',
      phone: '1234567890',
    });

    expect(result).toEqual(mockUser);
  });
});
