import { CustomConfigModule } from '@core/config/config.module';
import { Module } from '@nestjs/common';
import { AwsS3Service } from '@src/core/aws/s3/services/aws-s3.service';

@Module({
  imports: [CustomConfigModule],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
