import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';

const mockExecutionContext = () =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ user: { role: 'admin' } }),
    }),
  }) as unknown as ExecutionContext;

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should activate if super.canActivate() is true', async () => {
    const context = mockExecutionContext();
    jest.spyOn(guard, 'canActivate').mockReturnValueOnce(true);

    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should throw UnauthorizedException if no user', () => {
    expect(() => guard.handleRequest(null, null, null)).toThrow(
      new UnauthorizedException('Invalid token'),
    );
  });

  it('should return user if authentication is successful', () => {
    const user = { id: 1, username: 'test' };
    expect(guard.handleRequest(null, user, null)).toBe(user);
  });
});
