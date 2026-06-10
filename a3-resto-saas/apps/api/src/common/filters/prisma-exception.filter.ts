import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { apiError } from '../responses/api-response';
import { mapPrismaError } from '../prisma/prisma-error.mapper';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const mapped = mapPrismaError(exception);

    const status =
      exception.code === 'P2002'
        ? HttpStatus.CONFLICT
        : exception.code === 'P2025'
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST;

    response.status(status).json(apiError(mapped, mapped.message));
  }
}
