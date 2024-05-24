import { ApiProperty } from '@nestjs/swagger';
import { Authentication, Provider, User } from '@prisma/client';
import { transformS3Url } from '@src/utils/s3-url-transformer';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class BasicUserDto
  implements Pick<User, 'id' | 'nickname' | 'profileImageKey'>
{
  @ApiProperty({
    type: Number,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '유저 닉네임',
  })
  @Expose()
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지',
  })
  @Expose()
  @Transform(({ obj }) => transformS3Url({ value: obj.profileImageKey }), {
    toClassOnly: true,
  })
  url: string;

  profileImageKey: string;
}
