import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from '../local.strategy';
import { AuthService } from '../../../domain/services/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { mockUser as mockUserEntity } from '../../../../../../test/mocks/entities/user.entity.mock';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  it('should validate a user with correct credentials', async () => {
    const mockUser = mockUserEntity;
    jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);

    const result = await localStrategy.validate('testuser', 'password123');

    expect(authService.validateUser).toHaveBeenCalledWith(
      'testuser',
      'password123',
    );
    expect(result).toEqual(mockUser);
  });

  it('should throw UnauthorizedException if credentials are invalid', async () => {
    jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

    await expect(
      localStrategy.validate('invaliduser', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
