import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TOKEN_TYPE } from '@src/constants/consts/token-type.const';

@Injectable()
export class AllowGuestGuard extends AuthGuard(TOKEN_TYPE.ACCESS_TOKEN) {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const cookie = request.cookies?.accessToken;

    return cookie ? super.canActivate(context) : true;
  }
}
