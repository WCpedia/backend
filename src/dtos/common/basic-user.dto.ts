import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BasicUserDto implements Pick<User, 'id' | 'name'> {
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

  constructor(user: Partial<BasicUserDto>) {
    Object.assign(this, user);
  }
}
