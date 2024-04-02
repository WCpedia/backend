import { IsNotEmpty, IsString } from 'class-validator';

export class S3ObjectDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  constructor(key: string) {
    this.key = key;
  }
}
