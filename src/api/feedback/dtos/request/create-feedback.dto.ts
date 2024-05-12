import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({
    description: '피드백 내용',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
