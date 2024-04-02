import { Module } from '@nestjs/common';
import { AwsS3Module } from '@src/core/aws/s3/aws-s3.module';

@Module({
  imports: [AwsS3Module],
  providers: [],
  exports: [],
})
export class AwsModule {}
