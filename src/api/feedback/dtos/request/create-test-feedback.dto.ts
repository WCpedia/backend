import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTestFeedbackDto {
  @ApiProperty({
    description: '성별',
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    description: '이유',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: '기타 이유',
  })
  @IsString()
  @IsOptional()
  otherReason: string;

  @ApiProperty({
    description: '코멘트',
  })
  @IsString()
  @IsOptional()
  comments: string;
}
