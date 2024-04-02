import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { CustomException } from '@exceptions/http/custom.exception';
import { MulterExceptionEnum } from '@src/exceptions/http/enums/global.exception.enum';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';

@Injectable()
export class FormDataJsonInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    try {
      const request = context.switchToHttp().getRequest<Request>();

      const body = JSON.parse(request.body.data);
      request.body = body;
    } catch (err) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        MulterExceptionEnum.MultipartDataIsNotInJsonFormat,
      );
    }

    return next.handle();
  }
}
