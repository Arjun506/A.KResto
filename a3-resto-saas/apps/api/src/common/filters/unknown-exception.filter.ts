import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { apiError } from '../responses/api-response';

@Catch()
export class UnknownExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error('[UnknownExceptionFilter] Caught exception:', exception);

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(apiError('Internal server error', 'Internal server error'));
  }
}
