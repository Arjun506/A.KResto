import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, createApiSuccess } from '../responses/api-response';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const traceId = request.headers['x-correlation-id'] || request.id;

    return next.handle().pipe(
      map((responsePayload) => {
        // If response is already formatted as ApiResponse, return it directly
        if (
          responsePayload &&
          typeof responsePayload === 'object' &&
          'success' in responsePayload &&
          'timestamp' in responsePayload
        ) {
          return responsePayload;
        }

        // If response payload contains data and meta explicitly
        if (
          responsePayload &&
          typeof responsePayload === 'object' &&
          'data' in responsePayload &&
          'meta' in responsePayload
        ) {
          const { data, meta, message } = responsePayload;
          return createApiSuccess(data, message, meta, traceId);
        }

        return createApiSuccess(responsePayload, undefined, undefined, traceId);
      }),
    );
  }
}
