export enum MulterExceptionEnum {
  MULTIPART_FILE_IS_NOT_IN_FORMAT = 'MultipartFileIsNotInFormat',
  INVALID_ADDRESS_FORMAT = 'InvalidAddressFormat',
  MULTIPART_DATA_IS_NOT_IN_JSON_FORMAT = 'MultipartDataIsNotInJsonFormat',
  AWS_S3_CLIENT_REQUEST_ERROR = 'AwsS3ClientRequestError',
}

export enum AuthExceptionEnum {
  NO_AUTH_TOKEN = 'NoAuthToken',
  INVALID_TOKEN = 'InvalidToken',
  JWT_EXPIRED = 'JwtExpired',
  UNAUTHORIZED = 'Unauthorized',
  INVALID_EMAIL = 'InvalidEmail',
}

export const AuthExceptionMessage = {
  [AuthExceptionEnum.NO_AUTH_TOKEN]: '인증 토큰이 없습니다.',
  [AuthExceptionEnum.INVALID_TOKEN]: '유효하지 않은 토큰입니다.',
  [AuthExceptionEnum.JWT_EXPIRED]: 'JWT 토큰이 만료되었습니다.',
  [AuthExceptionEnum.UNAUTHORIZED]: '인증되지 않았습니다.',
  [AuthExceptionEnum.INVALID_EMAIL]: '유효하지 않은 이메일 형식입니다.',
};
