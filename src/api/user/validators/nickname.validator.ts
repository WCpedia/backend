import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import * as Filter from 'badwords-ko';
import { UserLength } from '../constants/const/length';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint()
export class NicknameValidator
  implements PipeTransform, ValidatorConstraintInterface
{
  private validateNickname(nickname: string): void {
    const filter = new Filter();
    if (typeof nickname !== 'string') {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        'InvalidNicknameFormat',
      );
    }

    if (
      nickname.length < UserLength.NICKNAME.MIN ||
      nickname.length > UserLength.NICKNAME.MAX
    ) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        'InvalidNicknameLength',
      );
    }
    console.log(nickname);

    if (filter.isProfane(nickname)) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        'InvalidNickname',
      );
    }
  }

  transform(value: any) {
    this.validateNickname(value);

    return value;
  }

  validate(value: any): boolean | Promise<boolean> {
    this.validateNickname(value);

    return true;
  }
}

export function IsUsableNickname(options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: NicknameValidator,
    });
  };
}
