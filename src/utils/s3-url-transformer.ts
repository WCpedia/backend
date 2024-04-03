import { AWS_S3_KEY } from '@core/config/constants/config.constant';
import { ProductConfigService } from '@core/config/services/config.service';
import { ConfigService } from '@nestjs/config';

const configService = new ProductConfigService(new ConfigService());

export function transformS3Url({ value }) {
  const S3_BASE_URL = configService.get(AWS_S3_KEY.S3_BUCKET_URL);

  return value ? `${S3_BASE_URL}/${value}` : null;
}
