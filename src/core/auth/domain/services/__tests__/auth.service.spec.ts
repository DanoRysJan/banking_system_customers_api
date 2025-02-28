import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { EmailNotFoundError } from '../../exceptions/user-email.exception';
import { RoleNotFoundError } from '../../exceptions/rol.exception';
import { RoleCode } from '../../../../role/domain/models/role.entity';
import { RoleType } from '../../../../party/domain/models/party.entity';
import { mockUser as mockUserEntity } from '../../../../../../test/mocks/entities/user.entity.mock';

const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByUsername: jest.fn(),
};

const mockRoleRepository = {
  findByCode: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'test-secret' });
    authService = new AuthService(
      jwtService,
      mockUserRepository,
      mockRoleRepository,
    );
  });

  describe('validateUser', () => {
    it('should return user data without password if credentials are valid', async () => {
      const mockUser = mockUserEntity;
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw EmailNotFoundError if user is not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      await expect(
        authService.validateUser('test@example.com', 'password'),
      ).rejects.toThrow(EmailNotFoundError);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const mockUser = mockUserEntity;
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        authService.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const mockUser = mockUserEntity;
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_token');

      const result = await authService.login(mockUser);
      expect(result).toEqual({ access_token: 'mocked_token' });
    });
  });

  describe('register', () => {
    it('should create a new user with hashed password and default role', async () => {
      const mockUser = mockUserEntity;
      const mockRole = { code: RoleCode.READ_ONLY };
      mockRoleRepository.findByCode.mockResolvedValue(mockRole);
      mockUserRepository.create.mockResolvedValue({
        ...mockUser,
        role: mockRole,
      });

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password' as never);
      const result = await authService.register(mockUser);

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...mockUser,
        password: 'hashed_password',
        role: mockRole,
      });
      expect(result).toHaveProperty('role', mockRole);
    });

    it('should throw RoleNotFoundError if default role is not found', async () => {
      mockRoleRepository.findByCode.mockResolvedValue(null);
      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(RoleNotFoundError);
    });
  });
});
