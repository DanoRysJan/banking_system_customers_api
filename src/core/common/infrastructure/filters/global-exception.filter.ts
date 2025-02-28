import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppError } from '../../domain/exceptions/app-error';
import { QueryFailedError } from 'typeorm';
import { PostgresErrorCodes } from '../../../common/domain/enums/postgres.errors';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage = exception.getResponse();

      if (typeof responseMessage === 'object' && responseMessage !== null) {
        message = responseMessage['message'] || JSON.stringify(responseMessage);
      } else {
        message = responseMessage as string;
      }
    } else if (exception instanceof AppError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    } else if (exception instanceof QueryFailedError) {
      const error = exception as QueryFailedError & { code: string };
      if (error.code === PostgresErrorCodes.UNIQUE_VIOLATION) {
        status = HttpStatus.CONFLICT;
        message = 'This entity already exists.';
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
