export enum MulterExceptionEnum {
  MULTIPART_FILE_IS_NOT_IN_FORMAT = 'MultipartFileIsNotInFormat',
  INVALID_ADDRESS_FORMAT = 'InvalidAddressFormat',
  MULTIPART_DATA_IS_NOT_IN_JSON_FORMAT = 'MultipartDataIsNotInJsonFormat',
  AWS_S3_CLIENT_REQUEST_ERROR = 'AwsS3ClientRequestError',
}

export enum AuthExceptionEnum {
  NO_AUTH_TOKEN = 'NoAuthToken',
  INVALID_TOKEN = 'InvalidToken',
  INVALID_OAUTH_TOKEN = 'InvalidOAuthToken',
  JWT_EXPIRED = 'JwtExpired',
  UNAUTHORIZED = 'Unauthorized',
  INVALID_EMAIL = 'InvalidEmail',
  DIFFERENT_SIGNUP_PROVIDER = 'DifferentSignUpProvider',
  TEMP_AUTH_NOT_FOUND = 'TempAuthNotFound',
  INVALID_SIGNUP_INFORMATION = 'InvalidSignUpInformation',
}

export const AuthExceptionMessage = {
  [AuthExceptionEnum.NO_AUTH_TOKEN]: '인증 토큰이 없습니다.',
  [AuthExceptionEnum.INVALID_TOKEN]: '유효하지 않은 토큰입니다.',
  [AuthExceptionEnum.INVALID_OAUTH_TOKEN]: '유효하지 않은 OAuth 토큰입니다.',
  [AuthExceptionEnum.JWT_EXPIRED]: 'JWT 토큰이 만료되었습니다.',
  [AuthExceptionEnum.UNAUTHORIZED]: '인증되지 않았습니다.',
  [AuthExceptionEnum.INVALID_EMAIL]: '유효하지 않은 이메일 형식입니다.',
  [AuthExceptionEnum.DIFFERENT_SIGNUP_PROVIDER]:
    '다른 로그인 방식으로 가입된 이메일입니다.',
  [AuthExceptionEnum.TEMP_AUTH_NOT_FOUND]: '임시 가입 정보가 없습니다.',
  [AuthExceptionEnum.INVALID_SIGNUP_INFORMATION]:
    '유효하지 않은 가입 정보입니다.',
};
