import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { UnknownExceptionFilter } from './common/filters/unknown-exception.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new ValidationExceptionFilter(),
    new PrismaExceptionFilter(),
    new UnknownExceptionFilter(),
  );

  app.useGlobalInterceptors(new RequestLoggingInterceptor());

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

void bootstrap();
