import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('🔍 RoleGuard -> request.user:', user);
    console.log('🔍 Required role:', requiredRole);

    if (user?.role !== requiredRole) {
      throw new ForbiddenException('no permission');
    }
    return true;
  }
}
