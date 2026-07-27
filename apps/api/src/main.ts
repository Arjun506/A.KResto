import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { JsonLogger } from './common/logger/json-logger.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { UnknownExceptionFilter } from './common/filters/unknown-exception.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const isWorker = process.env.RUN_MODE === 'worker';

  if (isWorker) {
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: new JsonLogger(),
    });
    app.enableShutdownHooks();
    console.log('[AK OS Kernel] Background Queue Worker initialized successfully.');
    return;
  }

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: new JsonLogger(),
  });

  app.setGlobalPrefix('api/v1');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new UnknownExceptionFilter(),
    new PrismaExceptionFilter(),
    new ValidationExceptionFilter(),
    new HttpExceptionFilter(),
  );

  app.useGlobalInterceptors(
    new RequestLoggingInterceptor(),
    new TransformInterceptor(),
  );

  app.enableShutdownHooks();

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('AK OS Kernel Engine')
    .setDescription('Operating Intelligence Platform Kernel API Specifications')
    .setVersion('2035.1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port, '0.0.0.0');
  console.log(
    `[AK OS Kernel] Server listening on http://0.0.0.0:${port}/api/v1`,
  );
  console.log(
    `[AK OS Kernel] Swagger OpenAPI docs available at http://localhost:${port}/api/docs`,
  );
}

void bootstrap();
