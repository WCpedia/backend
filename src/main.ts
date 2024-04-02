import { ENVIRONMENT_KEY } from '@core/config/constants/config.constant';
import { ProductConfigService } from '@core/config/services/config.service';
import { HttpExceptionFilter } from '@exceptions/http/filters/http-exception.filter';
import { SuccessInterceptor } from '@interceptors/success.interceptor';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { UnauthorizedExceptionFilter } from '@exceptions/http/filters/unauthorized-exception.filter';
import { CustomExceptionFilter } from '@exceptions/http/filters/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const JSON_PATH = 'api-docs-json';
  const YAML_PATH = 'api-docs-yaml';
  const configService = app.get<ProductConfigService>(ProductConfigService);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Swagger')
    .setDescription(
      'api description</br>' +
        `<strong><a target="_black" href="${JSON_PATH}">JSON document</a></strong></br>` +
        `<strong><a target="_black" href="${YAML_PATH}">YAML document</a></strong></br>`,
    )
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document, {
    jsonDocumentUrl: JSON_PATH,
    yamlDocumentUrl: YAML_PATH,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    app.get<SuccessInterceptor>(SuccessInterceptor),
  );

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['Content-Type', 'Content-Disposition', 'Content-Location'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new UnauthorizedExceptionFilter(),
    new CustomExceptionFilter(),
  );

  app.disable('x-powered-by');
  app.use(cookieParser());

  const PORT = configService.get<number>(ENVIRONMENT_KEY.PORT) || 8080;
  Logger.log(`🐥 Server is Running on PORT ${PORT}! 🐥`);

  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
