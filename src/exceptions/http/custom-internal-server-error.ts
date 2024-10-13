import { CustomException } from './custom.exception';
import { HttpExceptionStatusCode } from './enums/http-exception-enum';

export class CustomInternalServerError extends CustomException {
  constructor(errorCode: string) {
    super(HttpExceptionStatusCode.INTERNAL_SERVER_ERROR, errorCode);
  }
}
