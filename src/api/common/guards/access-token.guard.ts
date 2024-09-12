import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TOKEN_TYPE } from '@src/constants/consts/token-type.const';

@Injectable()
export class AccessTokenGuard extends AuthGuard(TOKEN_TYPE.ACCESS_TOKEN) {}
