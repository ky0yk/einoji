import { HttpStatus } from './http-status';
import { ErrorCode } from '../../common/errors/error-codes';

export enum UserErrorCode {
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  SYSTEM_OVERLOAD = 'SYSTEM_OVERLOAD',
  INVALID_REQUEST = 'INVALID_REQUEST',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  TASK_NOT_AVAILABLE = 'TASK_NOT_AVAILABLE',
  TASK_PROCESS_ERROR = 'TASK_PROCESS_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

type ErrorResponseDetail = {
  statusCode: HttpStatus;
  userErrorCode: UserErrorCode;
  message: string;
};

export const ERROR_RESPONSE_MAP: Record<ErrorCode, ErrorResponseDetail> = {
  [ErrorCode.DDB_RESOURCE_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    userErrorCode: UserErrorCode.RESOURCE_NOT_FOUND,
    message: 'The requested data could not be found.',
  },
  [ErrorCode.DDB_THROUGHPUT_EXCEEDED]: {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    userErrorCode: UserErrorCode.SYSTEM_OVERLOAD,
    message: 'The system is currently busy. Please try again later.',
  },
  [ErrorCode.DDB_VALIDATION_ERROR]: {
    statusCode: HttpStatus.BAD_REQUEST,
    userErrorCode: UserErrorCode.INVALID_REQUEST,
    message: 'The provided data is invalid.',
  },
  [ErrorCode.DDB_INTERNAL_SERVER_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    userErrorCode: UserErrorCode.SYSTEM_ERROR,
    message: 'We encountered an internal error. Please try again.',
  },
  [ErrorCode.TASK_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    userErrorCode: UserErrorCode.TASK_NOT_AVAILABLE,
    message: 'The requested task could not be found.',
  },
  [ErrorCode.TASK_CONVERSION_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    userErrorCode: UserErrorCode.TASK_PROCESS_ERROR,
    message: 'Failed to process the task data.',
  },
  [ErrorCode.TASK_UNKNOWN_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    userErrorCode: UserErrorCode.UNKNOWN_ERROR,
    message: 'An unexpected error occurred with the task.',
  },
  [ErrorCode.UNKNOWN_ERROR]: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    userErrorCode: UserErrorCode.UNKNOWN_ERROR,
    message: 'An unexpected error occurred. Please try again.',
  },
  [ErrorCode.INVALID_REQUEST]: {
    statusCode: HttpStatus.BAD_REQUEST,
    userErrorCode: UserErrorCode.INVALID_REQUEST,
    message:
      'The provided request data is not valid. Please check and try again.',
  },
};
