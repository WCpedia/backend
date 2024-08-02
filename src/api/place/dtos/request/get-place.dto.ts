import { IsNumberArray } from '@api/common/decorators/is-number-array.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetPlaceDto {
  @ApiProperty({
    description: '차단한 유저의 아이디 배열',
    type: [Number],
    required: false,
  })
  @IsNumberArray()
  @IsOptional()
  blockedUserIds?: number[];
}
