import { CustomException } from './custom.exception';
import { HttpExceptionStatusCode } from './enums/http-exception-enum';

export class CustomBadRequest extends CustomException {
  constructor(errorCode: string) {
    super(HttpExceptionStatusCode.BAD_REQUEST, errorCode);
  }
}
