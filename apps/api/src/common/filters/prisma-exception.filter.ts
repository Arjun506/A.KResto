import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { createApiError } from '../responses/api-response';
import { mapPrismaError } from '../prisma/prisma-error.mapper';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const mapped = mapPrismaError(exception);
    const traceId = (request.headers['x-correlation-id'] ||
      (request as any).id) as string;

    const status =
      exception.code === 'P2002'
        ? HttpStatus.CONFLICT
        : exception.code === 'P2025'
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST;

    response
      .status(status)
      .json(
        createApiError(
          `PRISMA_${exception.code}`,
          mapped.message || 'Database operation failed',
          mapped,
          traceId,
        ),
      );
  }
}
