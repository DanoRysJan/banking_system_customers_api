import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '@core/auth/shared/interfaces/payload.interface';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('test-secret'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate and return user payload', async () => {
    const payload = { sub: 'user-id', email: 'user@example.com', role: 'USER' };

    const result: AuthenticatedUser = await jwtStrategy.validate(payload);

    expect(result).toEqual({
      id: 'user-id',
      email: 'user@example.com',
      role: 'USER',
    });
  });

  it('should throw UnauthorizedException if payload is invalid', async () => {
    const payload = {};

    await expect(jwtStrategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
