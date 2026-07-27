import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createApiError } from '../responses/api-response';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responsePayload = exception.getResponse();
    const traceId = (request.headers['x-correlation-id'] ||
      (request as any).id) as string;

    let details = responsePayload;
    let message = 'Validation failed';

    if (
      typeof responsePayload === 'object' &&
      responsePayload !== null &&
      'message' in responsePayload
    ) {
      const msg = responsePayload.message;
      if (Array.isArray(msg)) {
        message = msg.join('; ');
        details = msg;
      } else if (typeof msg === 'string') {
        message = msg;
      }
    }

    response
      .status(exception.getStatus())
      .json(createApiError('VALIDATION_ERROR', message, details, traceId));
  }
}
