import { OmitType } from '@nestjs/swagger';
import { ReviewWithDetailsDto } from '../../../common/dto/review-with-details.dto';
import { Exclude } from 'class-transformer';

@Exclude()
export class MyPlaceReviewDto extends OmitType(ReviewWithDetailsDto, [
  'helpfulReviews',
] as const) {}
