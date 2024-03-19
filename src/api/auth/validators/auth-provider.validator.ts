import { ValidatorConstraint } from 'class-validator';
import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Provider } from '@prisma/client';

@ValidatorConstraint()
export class ProviderValidator implements PipeTransform {
  transform(provider: string): Provider {
    const convertedProvider = Provider[provider.toUpperCase()];
    if (!Provider.hasOwnProperty(convertedProvider)) {
      throw new BadRequestException(`지원하지 않는 인증 방식입니다.`);
    }

    return convertedProvider;
  }
}
