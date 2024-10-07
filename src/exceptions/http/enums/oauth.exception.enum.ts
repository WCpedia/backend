export enum OAuthExceptionEnum {
  INVALID_OAUTH_TOKEN = 'InvalidOAuthToken',
  OAUTH_SERVER_ERROR = 'OAuthServerError',
  UNSUPPORTED_PROVIDER = 'UnsupportedProvider',
}

export const OAuthExceptionMessage = {
  [OAuthExceptionEnum.INVALID_OAUTH_TOKEN]: '유효하지 않은 OAuth 토큰입니다.',
  [OAuthExceptionEnum.OAUTH_SERVER_ERROR]: 'OAuth 서버 오류',
  [OAuthExceptionEnum.UNSUPPORTED_PROVIDER]: '지원하지 않는 로그인 방식입니다.',
};
