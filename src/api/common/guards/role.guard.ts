import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/role.decorator';
import { Role } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const roles =
      this.reflector.get<Role[]>(ROLE_KEY, context.getHandler()) ||
      this.reflector.get<Role[]>(ROLE_KEY, context.getClass());

    if (roles.includes(user.role)) {
      return true;
    } else {
      throw new ForbiddenException(
        'You are not authorized to access this resource',
      );
    }
  }
}
