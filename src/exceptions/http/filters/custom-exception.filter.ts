import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from '../custom.exception';

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter<CustomException> {
  private logger = new Logger(CustomExceptionFilter.name);

  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const errorCode = exception.getResponse();

    const res = {
      statusCode,
      errorCode,
    };

    this.logger.error(res);
    this.logger.error(exception.stack);

    response.status(statusCode).json(res);
  }
}
