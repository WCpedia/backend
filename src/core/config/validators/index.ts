import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';

const REDIS_KEY_VALIDATOR = {
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().required(),
  TEMP_AUTH_TTL: Joi.string().required(),
};

const JWT_KEY_VALIDATOR = {
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
};

const EMAIL_KEY_VALIDATOR = {
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().required(),
  EMAIL_AUTH_USER: Joi.string().required(),
  EMAIL_AUTH_PASSWORD: Joi.string().required(),
  EMAIL_VERIFICATION_EXPIRATION_TIME: Joi.number().required(),
};

const AWS_S3_KEY_VALIDATOR = {
  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_KEY: Joi.string().required(),
  S3_BUCKET_REGION: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
};

const DATABASE_KEY_VALIDATOR = {
  DATABASE_URL: Joi.string().required(),
};

export const ENVIRONMENT_KEY_VALIDATOR: ConfigModuleOptions = {
  isGlobal: true,
  validationOptions: Joi.object({
    PORT: Joi.number().required(),
    ...DATABASE_KEY_VALIDATOR,
    ...EMAIL_KEY_VALIDATOR,
    ...REDIS_KEY_VALIDATOR,
    ...JWT_KEY_VALIDATOR,
    ...AWS_S3_KEY_VALIDATOR,
  }),
};
