import { BaseReturnDto } from '@dtos/common/base-return.dto';
import { BasicUserDto } from '@dtos/common/basic-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class PostWithUserDto
  extends BaseReturnDto
  implements Omit<Post, 'userId' | 'deletedAt'>
{
  @ApiProperty({
    type: Number,
    description: '유저 Id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: Number,
    description: '유저 Id',
  })
  @Expose()
  title: string;

  @ApiProperty({
    type: Number,
    description: '유저 Id',
  })
  @Expose()
  description: string;

  @ApiProperty({
    type: BasicUserDto,
    description: '유저 정보',
  })
  @Expose()
  @Type(() => BasicUserDto)
  user: BasicUserDto;

  constructor(post: Partial<PostWithUserDto>) {
    super();
    Object.assign(this, post);
  }
}
