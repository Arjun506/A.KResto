import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

import { apiError } from '../responses/api-response';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const responsePayload = exception.getResponse();

    const message =
      typeof responsePayload === 'object' &&
      responsePayload !== null &&
      'message' in responsePayload
        ? Array.isArray((responsePayload as { message: unknown[] }).message)
          ? ((responsePayload as { message: unknown[] }).message[0] as
              | string
              | undefined)
          : undefined
        : undefined;

    response
      .status(exception.getStatus())
      .json(apiError(responsePayload, message || 'Validation failed'));
  }
}
