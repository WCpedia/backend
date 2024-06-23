import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MulterExceptionEnum } from '@src/exceptions/http/enums/global.exception.enum';
import { CustomException } from '@exceptions/http/custom.exception';
import { S3ObjectDto } from '@src/core/aws/s3/dtos/s3-object.dto';
import { MulterBuilder } from '@src/utils/multer/multer.builder';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AwsS3Service extends MulterBuilder {
  constructor() {
    super();
  }

  /**
   * * 파일 업로드 (multer 미사용 시)
   * * multer를 사용하지 않고 직접 파일을 업로드할 때 사용
   * @Post('upload')
   * @UseInterceptors(FileInterceptor('file'))
   * async uploadFile(@UploadedFile() file: Express.Multer.File) {
   *    return this.awsS3Service.upload(file, 'image', 'example');
   * }
   * ```
   */
  async upload(file: Express.Multer.File, path: string): Promise<S3ObjectDto> {
    const ext = file.originalname.split('.').pop().toLowerCase();
    const key = `${path}/${uuidv4()}.${ext}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await this.s3.send(command);

      return new S3ObjectDto(key);
    } catch (e) {
      throw new CustomException(
        HttpExceptionStatusCode.INTERNAL_SERVER_ERROR,
        MulterExceptionEnum.AWS_S3_CLIENT_REQUEST_ERROR,
      );
    }
  }

  async delete(object: S3ObjectDto): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: object.key,
      });
      await this.s3.send(command);
    } catch (e) {
      throw new CustomException(
        HttpExceptionStatusCode.INTERNAL_SERVER_ERROR,
        MulterExceptionEnum.AWS_S3_CLIENT_REQUEST_ERROR,
      );
    }
  }

  async deleteMany(objectKeys: string[]): Promise<void> {
    try {
      const command = new DeleteObjectsCommand({
        Bucket: this.bucketName,
        Delete: {
          Objects: objectKeys.map((object) => {
            return { Key: object };
          }),
        },
      });
      await this.s3.send(command);
    } catch (e) {
      throw new CustomException(
        HttpExceptionStatusCode.INTERNAL_SERVER_ERROR,
        MulterExceptionEnum.AWS_S3_CLIENT_REQUEST_ERROR,
      );
    }
  }

  //S3 파일 압축 및 저장
  async compressAndSaveFolder(
    folderPath: string,
    key: string,
  ): Promise<string> {
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: folderPath,
      });
      const listResponse = await this.s3.send(listCommand);

      if (!listResponse.Contents || listResponse.Contents.length === 0) {
        throw new CustomException(
          HttpExceptionStatusCode.NOT_FOUND,
          MulterExceptionEnum.AWS_S3_CLIENT_REQUEST_ERROR,
        );
      }

      const archive = archiver('zip', { zlib: { level: 9 } });
      const localFilePath = path.join(key);

      const output = fs.createWriteStream(localFilePath);
      archive.pipe(output);

      for (const item of listResponse.Contents) {
        const getObjectCommand = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: item.Key,
        });
        const objectResponse = await this.s3.send(getObjectCommand);
        archive.append(objectResponse.Body as any, {
          name: item.Key.replace(folderPath, ''),
        });
      }

      await archive.finalize();

      return localFilePath;
    } catch (e) {
      throw new CustomException(
        HttpExceptionStatusCode.INTERNAL_SERVER_ERROR,
        MulterExceptionEnum.AWS_S3_CLIENT_REQUEST_ERROR,
      );
    }
  }
}
