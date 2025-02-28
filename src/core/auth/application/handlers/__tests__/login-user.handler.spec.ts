import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserHandler } from '../login-user.handler';
import { LoginUserCommand } from '../../commands/login-user.command';
import { AuthService } from '../../../../auth/domain/services/auth.service';
import { mockUser as mockUserEntity } from '../../../../../../test/mocks/entities/user.entity.mock';

describe('LoginUserHandler', () => {
  let handler: LoginUserHandler;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUserHandler,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<LoginUserHandler>(LoginUserHandler);
    authService = module.get<AuthService>(AuthService);
  });

  it('should validate user and return JWT token', async () => {
    const mockUser = mockUserEntity;
    const mockToken = { access_token: 'jwt-token' };

    jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
    jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

    const command = new LoginUserCommand({
      email: 'test@example.com',
      password: 'password123',
    });
    const result = await handler.execute(command);

    expect(authService.validateUser).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
    );
    expect(authService.login).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockToken);
  });
});
