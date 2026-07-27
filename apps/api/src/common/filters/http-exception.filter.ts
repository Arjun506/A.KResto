import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createApiError } from '../responses/api-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const payload = exception.getResponse();
    const traceId = (request.headers['x-correlation-id'] ||
      (request as any).id) as string;

    let message = exception.message;
    let details: unknown = payload;
    let errorCode = `HTTP_${status}`;

    if (typeof payload === 'object' && payload !== null) {
      const pObj = payload as Record<string, any>;
      if (pObj.message) {
        message = Array.isArray(pObj.message)
          ? pObj.message.join(', ')
          : pObj.message;
      }
      if (pObj.error) {
        errorCode = String(pObj.error).toUpperCase().replace(/\s+/g, '_');
      }
      details = pObj.details || pObj.message;
    }

    const resBody = createApiError(errorCode, message, details, traceId);

    response.status(status).json(resBody);
  }
}
