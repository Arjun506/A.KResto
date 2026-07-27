import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createApiError } from '../responses/api-response';

@Catch()
export class UnknownExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const traceId = (request.headers['x-correlation-id'] ||
      (request as any).id) as string;
    console.error('[UnknownExceptionFilter] Unhandled Exception:', exception);

    const errorMessage =
      exception instanceof Error ? exception.message : 'Internal server error';

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        createApiError(
          'INTERNAL_SERVER_ERROR',
          errorMessage,
          process.env.NODE_ENV === 'development' && exception instanceof Error
            ? { stack: exception.stack }
            : undefined,
          traceId,
        ),
      );
  }
}
