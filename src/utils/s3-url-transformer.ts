import { AWS_S3_KEY } from '@core/config/constants/config.constant';
import { ProductConfigService } from '@core/config/services/config.service';
import { ConfigService } from '@nestjs/config';

const configService = new ProductConfigService(new ConfigService());
const S3_BASE_URL: string = configService.get(AWS_S3_KEY.S3_BUCKET_URL);

export function transformS3Url({ value }) {
  return value ? `${S3_BASE_URL}/${value}` : null;
}

export function extractS3Key(fullUrl: string): string | null {
  if (!fullUrl || !fullUrl.startsWith(S3_BASE_URL)) {
    return null;
  }

  return fullUrl.substring(S3_BASE_URL.length + 1);
}
