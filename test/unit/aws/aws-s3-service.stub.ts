import { AwsS3Service } from '@src/core/aws/s3/services/aws-s3.service';

type PartialAwsS3Service = Partial<AwsS3Service>;

export default class AwsS3ServiceStub implements PartialAwsS3Service {
  async deleteMany(objectKeys: string[]): Promise<void> {
    return;
  }
}
