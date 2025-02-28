import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { GlobalExceptionsFilter } from '../global-exception.filter';
import { AppError } from '../../../../common/domain/exceptions/app-error';
import { PostgresErrorCodes } from '../../../../common/domain/enums/postgres.errors';

describe('GlobalExceptionsFilter', () => {
  let filter: GlobalExceptionsFilter;
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new GlobalExceptionsFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ArgumentsHost;
  });

  it('should return default internal server error for unknown exception', () => {
    const unknownError = new Error('Unexpected error');

    filter.catch(unknownError, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  });

  it('should return proper response for HttpException', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.FORBIDDEN,
      message: 'Forbidden',
    });
  });

  it('should handle HttpException with object response', () => {
    const exception = new HttpException(
      { message: 'Custom error' },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Custom error',
    });
  });

  it('should handle AppError as bad request', () => {
    const exception = new AppError('Custom AppError message');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Custom AppError message',
    });
  });

  it('should handle unique constraint violation in QueryFailedError', () => {
    const exception = new QueryFailedError(
      'query',
      [],
      new Error(),
    ) as QueryFailedError & {
      code: string;
    };
    exception.code = PostgresErrorCodes.UNIQUE_VIOLATION;

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: 'This entity already exists.',
    });
  });
});
