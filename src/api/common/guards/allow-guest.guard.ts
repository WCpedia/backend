import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AllowGuestGuard extends AuthGuard('accessToken') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const cookie = request.cookies?.accessToken;

    return cookie ? super.canActivate(context) : true;
  }
}
