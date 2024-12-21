import path from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import dotenv from 'dotenv';
import { AppModule } from './app.module';
import type {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './common/configs/config.interface';
import { CustomLogger } from './common/logger/logger.service';

const baseEnvPath = path.resolve(__dirname, '../.env'); // Load base .env file first
dotenv.config({ path: baseEnvPath });

// Then load environment specific .env file
const nodeEnv = process.env.NODE_ENV || 'local';
const envPath = path.resolve(__dirname, `../.env.${nodeEnv}`);
dotenv.config({ path: envPath, override: true });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true  // logger: false 대신 bufferLogs: true 사용
  });

  const logger = app.get(CustomLogger);
  app.useLogger(logger);

  logger.log(`Loading base environment variables from ${baseEnvPath}`);
  logger.log(`Loading environment variables NODE_ENV: ${process.env.NODE_ENV}`);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // enable shutdown hook
  app.enableShutdownHooks();

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs')
      .setDescription(swaggerConfig.description || 'The nestjs API description')
      .setVersion(swaggerConfig.version || '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  await app.listen(process.env.PORT || nestConfig.port || 3000);

  logger.log(`🚀 Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
