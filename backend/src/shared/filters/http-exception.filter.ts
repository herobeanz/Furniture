import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
  details?: unknown;
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let error: string | undefined;
    let details: unknown;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const obj = res as Record<string, unknown>;
        message = (obj.message as string) || message;
        error = (obj.error as string) || error;
        details = obj.details ?? obj.errors;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(exception.message, exception.stack);
    }

    const body: ErrorResponse = {
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    if (error) body.error = error;
    if (details !== undefined) body.details = details;

    response.status(status).json(body);
  }
}
