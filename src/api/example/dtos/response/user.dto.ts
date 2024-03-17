import { BaseReturnDto } from '@dtos/common/base-return.dto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto extends BaseReturnDto implements User {
  @ApiProperty({
    type: Number,
    description: '유저 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '이름',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: '이메일',
  })
  @Expose()
  email: string;

  deletedAt: Date;

  constructor(user: Partial<UserDto>) {
    super();
    Object.assign(this, user);
  }
}
