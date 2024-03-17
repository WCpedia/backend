import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: '이름',
    required: false,
  })
  @IsOptional()
  name: string;
}
