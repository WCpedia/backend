import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AllowGuestGuard extends AuthGuard('accessToken') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request?.cookie?.accessToken ? super.canActivate(context) : true;
  }
}
