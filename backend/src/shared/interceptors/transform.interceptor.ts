import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        const payload: ApiResponse<T> = {
          success: true,
          data: data ?? (null as T),
          timestamp: new Date().toISOString(),
        };
        if (typeof data === 'object' && data !== null && 'message' in data) {
          payload.message = (data as { message?: string }).message;
        }
        return payload;
      }),
    );
  }
}
