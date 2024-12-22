import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { CustomLogger } from '../logger/logger.service';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const validationErrors = exception.getResponse() as { message: ValidationError[] };

    this.logger.error('Validation failed', null, 'ValidationFilter', {
      path: request.url,
      method: request.method,
      errors: validationErrors,
      body: request.body
    });

    response.status(400).json({
      statusCode: 400,
      message: 'Validation failed',
      errors: validationErrors
    });
  }
} 