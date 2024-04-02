import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { IUploadFileParams } from '@src/interface/common.interface';
import { CreateImageMulterOption } from './multer/multer.option';
import { UseInterceptors } from '@nestjs/common';
import { FormDataJsonInterceptor } from '@interceptors/form-data.interceptor';

export function UploadImages({ maxCount, path }: IUploadFileParams) {
  const interceptor =
    maxCount === 1
      ? FileInterceptor('image', CreateImageMulterOption(path))
      : FilesInterceptor('images', maxCount, CreateImageMulterOption(path));

  return UseInterceptors(interceptor, FormDataJsonInterceptor);
}
