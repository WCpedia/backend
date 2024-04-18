import { BasicPlaceDto } from '@api/common/dto/basic-place.dto';
import { ReviewWithDetailsDto } from '@api/common/dto/review-with-details.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose } from 'class-transformer';

export class DetailReviewWithPlaceDto extends ReviewWithDetailsDto {
  @ApiProperty({
    type: BasicPlaceDto,
    description: '장소 정보',
  })
  @Type(() => BasicPlaceDto)
  @Expose()
  place: BasicPlaceDto;
}
