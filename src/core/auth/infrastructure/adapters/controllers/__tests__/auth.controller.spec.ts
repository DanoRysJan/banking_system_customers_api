import { AuthController } from '../auth.controller';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../../../../application/commands/login-user.command';
import { RegisterUserCommand } from '../../../../application/commands/register-user.command';
import { LoginDto } from '@core/auth/shared/dto/login.dto';
import { RegisterUserDto } from '@core/auth/shared/dto/register.dto';
import { User } from '@core/user/domain/models/user.entity';

jest.mock('@nestjs/cqrs', () => ({
  CommandBus: jest.fn().mockImplementation(() => ({ execute: jest.fn() })),
}));

describe('AuthController', () => {
  let authController: AuthController;
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = {
      execute: jest.fn(),
    } as unknown as CommandBus;
    authController = new AuthController(commandBus);
  });

  describe('login', () => {
    it('should execute LoginUserCommand and return a token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockToken = { access_token: 'mocked_jwt_token' };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(mockToken);

      const result = await authController.login(loginDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new LoginUserCommand(loginDto),
      );
      expect(result).toEqual(mockToken);
    });
  });

  describe('register', () => {
    it('should execute RegisterUserCommand and return a new user', async () => {
      const registerDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'Test User',
        fullName: 'test',
        phone: '123123123',
      };
      const mockUser: User = { id: 1, ...registerDto } as unknown as User;
      jest.spyOn(commandBus, 'execute').mockResolvedValue(mockUser);

      const result = await authController.register(registerDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new RegisterUserCommand(registerDto),
      );
      expect(result).toEqual(mockUser);
    });
  });
});
