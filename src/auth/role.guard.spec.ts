import { RoleGuard } from './role.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = { get: jest.fn() } as any;
    guard = new RoleGuard(reflector);
  });

  it('should allow access when no role is required', () => {
    (reflector.get as jest.Mock).mockReturnValue(undefined);

    const context = {
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'user' } }),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access when user role matches', () => {
    (reflector.get as jest.Mock).mockReturnValue('admin');

    const context = {
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'admin' } }),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException when role mismatches', () => {
    (reflector.get as jest.Mock).mockReturnValue('admin');

    const context = {
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'user' } }),
      }),
    } as unknown as ExecutionContext;

    expect(() => guard.canActivate(context)).toThrowError('no permission');
  });
});