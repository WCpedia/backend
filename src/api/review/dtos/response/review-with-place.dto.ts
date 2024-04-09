import { BasicPlaceDto } from '@api/common/dto/basic-place.dto';
import { ReviewWithDetailsDto } from '@api/common/dto/review-with-details.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ReviewWithPlaceDto extends OmitType(ReviewWithDetailsDto, [
  'reviewReactions',
]) {
  @ApiProperty({
    type: BasicPlaceDto,
    description: '장소 정보',
  })
  @Type(() => BasicPlaceDto)
  @Expose()
  place: BasicPlaceDto;
}
