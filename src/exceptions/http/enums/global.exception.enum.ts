export enum MulterExceptionEnum {
  MultipartFileIsNotInFormat = 'MultipartFileIsNotInFormat',
  InvalidAddressFormat = 'InvalidAddressFormat',
  MultipartDataIsNotInJsonFormat = 'MultipartDataIsNotInJsonFormat',
  AwsS3ClientRequestError = 'AwsS3ClientRequestError',
}

export enum AuthExceptionEnum {
  NoAuthToken = 'NoAuthToken',
  InvalidToken = 'InvalidToken',
  JwtExpired = 'JwtExpired',
  Unauthorized = 'Unauthorized',
}
