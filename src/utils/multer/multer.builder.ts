import { S3Client } from '@aws-sdk/client-s3';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as multerS3 from 'multer-s3';
import multer from 'multer';
import { AWS_S3_KEY } from '@src/core/config/constants/config.constant';
import { CustomException } from '@exceptions/http/custom.exception';
import { MulterExceptionEnum } from '@src/exceptions/http/enums/global.exception.enum';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';

const configService = new ConfigService();

export class MulterBuilder {
  protected s3: S3Client;
  protected bucketRegion: string;
  protected bucketName: string;
  protected storage: multer.StorageEngine;
  protected limits: { fileSize: number; files: number };
  protected fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: any,
  ) => void;

  constructor() {
    this.bucketRegion = configService.get<string>(AWS_S3_KEY.S3_BUCKET_REGION);
    this.bucketName = configService.get<string>(AWS_S3_KEY.S3_BUCKET_NAME);
    this.s3 = new S3Client({
      region: this.bucketRegion,
      credentials: {
        accessKeyId: configService.get<string>(AWS_S3_KEY.S3_ACCESS_KEY),
        secretAccessKey: configService.get<string>(AWS_S3_KEY.S3_SECRET_KEY),
      },
    });
  }

  setStorage(path: string): this {
    this.storage = multerS3({
      s3: this.s3 as S3Client,
      bucket: this.bucketName,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: any, key?: string) => void,
      ) => {
        const ext = file.originalname.split('.').pop().toLowerCase();
        const key = `${path}/${uuidv4()}.${ext}`;
        return callback(null, encodeURI(key));
      },
    });
    return this;
  }

  setLimits(limits: { fileSize: number; files: number }): this {
    this.limits = limits;
    return this;
  }

  setFileFilter(kind: string[]): this {
    this.fileFilter = (req: Request, file: any, callback: any) => {
      if (!kind.includes(file.mimetype)) {
        callback(
          new BadRequestException(
            HttpExceptionStatusCode.BAD_REQUEST,
            MulterExceptionEnum.MultipartFileIsNotInFormat,
          ),
          false,
        );
      } else {
        callback(null, true);
      }
    };
    return this;
  }

  build(): multer.Options {
    return {
      storage: this.storage,
      limits: this.limits,
      fileFilter: this.fileFilter,
    };
  }
}
