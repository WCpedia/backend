import { BasicUserDto } from './basic-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Authentication, Provider } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class UserWithProviderDto extends BasicUserDto {
  @ApiProperty({
    description: '로그인 방식',
    enum: Provider,
  })
  @Transform(({ obj }) => obj.authentication.provider, {
    toClassOnly: true,
  })
  @Expose()
  provider: Provider;

  authentication: Authentication;
}
