import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerName = 'x-correlation-id';

    // Extract correlation ID or request ID from headers, fallback to a new UUID
    const correlationId =
      (req.headers[headerName] as string) ||
      (req.headers['x-request-id'] as string) ||
      randomUUID();

    // Attach to request object
    req['correlationId'] = correlationId;

    // Set header on response
    res.setHeader(headerName, correlationId);

    next();
  }
}
