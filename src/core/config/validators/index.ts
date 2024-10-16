import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';
import * as path from 'path';

const REDIS_KEY_VALIDATOR = {
  REDIS_URL: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_TEMP_AUTH_TTL: Joi.number().required(),
  REDIS_LATEST_REVIEW_TTL: Joi.number().required(),
  REDIS_LATEST_REVIEW_KEY: Joi.string().required(),
  REDIS_TOP_REVIEWERS_TTL: Joi.number().required(),
  REDIS_TOP_REVIEWERS_KEY: Joi.string().required(),
  REDIS_CATEGORY_KEY: Joi.string().required(),
  REDIS_LAST_CATEGORY_KEY: Joi.string().required(),
  REDIS_PLACE_CATEGORY_KEY: Joi.string().required(),
  REDIS_LAST_PLACE_CATEGORY_KEY: Joi.string().required(),
  REDIS_PLACE_CATEGORY_TTL: Joi.number().required(),
  REDIS_INFINITE_TTL: Joi.number().required(),
};

const JWT_KEY_VALIDATOR = {
  JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
};

const AWS_S3_KEY_VALIDATOR = {
  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_KEY: Joi.string().required(),
  S3_BUCKET_REGION: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
  S3_BUCKET_URL: Joi.string().required(),
};

const DATABASE_KEY_VALIDATOR = {
  DATABASE_URL: Joi.string().required(),
};

const OAUTH_KEY_VALIDATOR = {
  KAKAO_GET_USER_URI: Joi.string().required(),
  KAKAO_AUTHORIZATION_KEY: Joi.string().required(),
  KAKAO_SEARCH_KEYWORD_URI: Joi.string().required(),
  KAKAO_SEARCH_IMAGE_URI: Joi.string().required(),
  KAKAO_MENU_URI: Joi.string().required(),
  KAKAO_SEARCH_IMAGE_MAX_SIZE: Joi.number().required(),
  GOOGLE_GET_USER_URI: Joi.string().required(),
  NAVER_GET_USER_URI: Joi.string().required(),
  APPLE_GET_USER_URI: Joi.string().required(),
};

export const ENVIRONMENT_KEY_VALIDATOR: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: path.resolve(
    process.env.NODE_ENV === 'test' ? '.test.env' : '.env',
  ),
  validationOptions: Joi.object({
    PORT: Joi.number().required(),
    ADMIN_PATH: Joi.string().required(),
    ...DATABASE_KEY_VALIDATOR,
    ...REDIS_KEY_VALIDATOR,
    ...JWT_KEY_VALIDATOR,
    ...AWS_S3_KEY_VALIDATOR,
    ...OAUTH_KEY_VALIDATOR,
  }),
};
