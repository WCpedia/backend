import { CustomException } from './custom.exception';
import { HttpExceptionStatusCode } from './enums/http-exception-enum';

export class CustomNotFound extends CustomException {
  constructor(errorCode: string) {
    super(HttpExceptionStatusCode.NOT_FOUND, errorCode);
  }
}
