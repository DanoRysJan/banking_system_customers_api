import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from '../roles.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';

const mockExecutionContext = () =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user: { role: 'admin' } }),
    }),
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should allow access if no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = mockExecutionContext();

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user does not have required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: jest.fn().mockReturnValue({ user: { role: 'user' } }),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException(
        'You do not have permission to access this resource',
      ),
    );
  });

  it('should allow access if user has required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    const context = mockExecutionContext();
    jest
      .spyOn(context.switchToHttp(), 'getRequest')
      .mockReturnValue({ user: { role: 'admin' } });

    expect(guard.canActivate(context)).toBe(true);
  });
});
