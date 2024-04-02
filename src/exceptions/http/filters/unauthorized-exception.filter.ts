import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpExceptionStatusCode } from '../enums/http-exception-enum';
import { Response } from 'express';
import { AuthExceptionEnum } from '../enums/global.exception.enum';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  private logger = new Logger(UnauthorizedExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const errorMessageObject = ctx.getResponse().req.authInfo;
    const message = errorMessageObject.message;

    let errorCode: string;
    if (message) {
      if (message.includes('No auth token')) {
        errorCode = AuthExceptionEnum.NoAuthToken;
      } else if (
        message.includes('invalid signature') ||
        message.includes('invalid token')
      ) {
        errorCode = AuthExceptionEnum.InvalidToken;
      } else if (message.includes('jwt expired')) {
        errorCode = AuthExceptionEnum.JwtExpired;
      } else {
        errorCode = AuthExceptionEnum.Unauthorized;
      }

      const res = {
        statusCode,
        errorCode,
      };

      this.logger.error(res);
      this.logger.error(exception.stack);

      response.status(statusCode).json(res);
    }
  }
}
