import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class NicknameNotExistValidator
  implements PipeTransform, ValidatorConstraintInterface
{
  constructor(private readonly prismaService: PrismaService) {}

  private async checkNicknameExist(nickname: string): Promise<void> {
    const selectedUser = await this.prismaService.user.findFirst({
      where: { nickname },
    });

    if (selectedUser) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        'NicknameDuplicated',
      );
    }
  }
  //파이프
  async transform(nickname: string): Promise<any> {
    await this.checkNicknameExist(nickname);

    return nickname;
  }

  //밸리데이터
  async validate(nickname: string): Promise<boolean> {
    await this.checkNicknameExist(nickname);

    return true;
  }
}

export function IsNicknameNotExist() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      validator: NicknameNotExistValidator,
    });
  };
}
