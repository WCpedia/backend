import { ValidatorConstraint } from 'class-validator';
import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Provider } from '@prisma/client';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';

@ValidatorConstraint()
export class ProviderValidator implements PipeTransform {
  transform(provider: string): Provider {
    const convertedProvider = Provider[provider.toUpperCase()];
    if (!Provider.hasOwnProperty(convertedProvider)) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_GATEWAY,
        'InvalidProvider',
      );
    }

    return convertedProvider;
  }
}
