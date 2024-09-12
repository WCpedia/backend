import { Injectable, NotFoundException } from '@nestjs/common';
import { TOKEN_TYPE } from '@src/constants/consts/token-type.const';

@Injectable()
export class CookiesTokenExtractor {
  constructor() {}

  static refreshTokenFromCookies = function () {
    return function (request) {
      let token = null;
      if (!request.cookies) {
        throw new NotFoundException(
          `토큰이 존재하지 않습니다. 다시 로그인해주세요.`,
        );
      }

      token = request.cookies[TOKEN_TYPE.REFRESH_TOKEN];

      return token;
    };
  };
}
