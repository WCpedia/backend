import { ApiProperty } from '@nestjs/swagger';
import { Type, Expose, Exclude } from 'class-transformer';
import { BasicPlaceDto } from './basic-place.dto';
import { ReviewWithDetailsDto } from './review-with-details.dto';

@Exclude()
export class ReviewDetailWithPlaceDto extends ReviewWithDetailsDto {
  @ApiProperty({
    type: BasicPlaceDto,
    description: '장소 정보',
  })
  @Type(() => BasicPlaceDto)
  @Expose()
  place: BasicPlaceDto;
}
