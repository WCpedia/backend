import { OmitType } from '@nestjs/swagger';
import { PlaceReviewWithDetailsDto } from './place-review.dto';
import { Exclude } from 'class-transformer';

@Exclude()
export class MyPlaceReviewDto extends OmitType(PlaceReviewWithDetailsDto, [
  'reviewReactions',
] as const) {}
