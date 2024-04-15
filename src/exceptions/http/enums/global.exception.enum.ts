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
}
