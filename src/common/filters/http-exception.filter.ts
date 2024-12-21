import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { CustomLogger } from '../services/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    this.logger.error(
      'HTTP Exception occurred',
      exception.stack,
      'HttpExceptionFilter',
      {
        statusCode: status,
        path: request.url,
        method: request.method,
        body: request.body,
        params: request.params,
        query: request.query,
        errorCode: 'HTTP_EXCEPTION'
      }
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message
    });
  }
} 