import { IsNumberArray } from '@api/common/decorators/is-number-array.decorator';
import PaginationDto from '@api/common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetPlaceReviewDto extends PaginationDto {
  @ApiProperty({
    description: '차단한 유저의 아이디 배열',
    type: [Number],
    required: false,
  })
  @IsNumberArray()
  @IsOptional()
  blockedUserIds?: number[];
}
