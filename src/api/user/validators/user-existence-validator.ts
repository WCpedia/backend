import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { UserExceptionEnum } from '@exceptions/http/enums/user.exception.enum';
import { Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/services/prisma.service';

@Injectable()
export class UserExistenceValidationPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(userId: number): Promise<number> {
    const selectedUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!selectedUser) {
      throw new CustomException(
        HttpExceptionStatusCode.NOT_FOUND,
        UserExceptionEnum.USER_NOT_FOUND,
      );
    }

    return userId;
  }
}
