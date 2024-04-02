import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { IUploadFileParams } from '@src/interface/common.interface';
import { CreateImageMulterOption } from './multer/multer.option';
import { UseInterceptors } from '@nestjs/common';
import { FormDataJsonInterceptor } from '@interceptors/form-data.interceptor';
import { UploadFileLimit } from '@src/constants/consts/upload-file.const';

export function UploadImages({ maxCount, path }: IUploadFileParams) {
  const interceptor =
    maxCount === UploadFileLimit.SINGLE
      ? FileInterceptor(
          'image',
          CreateImageMulterOption(path, UploadFileLimit.SINGLE),
        )
      : FilesInterceptor(
          'images',
          maxCount,
          CreateImageMulterOption(path, maxCount),
        );

  return UseInterceptors(interceptor, FormDataJsonInterceptor);
}
