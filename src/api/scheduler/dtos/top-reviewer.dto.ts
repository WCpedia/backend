import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TopReviewerDto extends BasicUserDto {
  @Expose()
  totalReviewCount: number;
  @Expose()
  ratingAverage: number;
}
