import multer from 'multer';
import { MulterBuilder } from '@src/utils/multer/multer.builder';
import {
  CSV_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from '@src/utils/multer/multer.type';

/**
 * AWS S3에 이미지 업로드를 위한 multer options 생성
 *
 * @param   path - image/{directory}
 * @returns multer options
 */
export function CreateImageMulterOption(path: string): multer.Options {
  return new MulterBuilder()
    .setStorage(path)
    .setLimits({ fileSize: 1024 * 1024 * 20 })
    .setFileFilter(IMAGE_MIME_TYPES)
    .build();
}

export function CreateVideoMulterOption(path: string): multer.Options {
  return new MulterBuilder()
    .setStorage(path)
    .setLimits({ fileSize: 1024 * 1024 * 20 })
    .setFileFilter(VIDEO_MIME_TYPES)
    .build();
}

export function CreateMediaMulterOption(path: string): multer.Options {
  return new MulterBuilder()
    .setStorage(path)
    .setLimits({ fileSize: 1024 * 1024 * 20 })
    .setFileFilter([...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES])
    .build();
}

export function CreateCsvMulterOption(path: string): multer.Options {
  return new MulterBuilder()
    .setStorage(path)
    .setLimits({ fileSize: 1024 * 1024 * 20 })
    .setFileFilter(CSV_MIME_TYPES)
    .build();
}
