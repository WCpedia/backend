import { HttpException } from '@nestjs/common';
import { HttpExceptionStatusCode } from './enums/http-exception-enum';

export class CustomException extends HttpException {
  constructor(statusCode: HttpExceptionStatusCode, errorCode: string) {
    super(errorCode, statusCode);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
  errorCode: string;
  statusCode: number;
}
