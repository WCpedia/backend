import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const statusCode = context.getArgByIndex(1).statusCode;

    return next.handle().pipe(
      map((data) => {
        if (data && data.statusCode) {
          const { statusCode, ...etc } = data;

          return { statusCode, data: etc };
        }

        return { statusCode, data };
      }),
    );
  }
}
