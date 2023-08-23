import { HttpStatus } from '../handlers/http/http-response';

export enum ErrorCode {
  DDB_RESOURCE_NOT_FOUND = 'DDB_RESOURCE_NOT_FOUND',
  DDB_THROUGHPUT_EXCEEDED = 'DDB_THROUGHPUT_EXCEEDED',
  DDB_VALIDATION_ERROR = 'DDB_VALIDATION_ERROR',
  DDB_INTERNAL_SERVER_ERROR = 'DDB_INTERNAL_SERVER_ERROR',
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',
  TASK_CONVERSION_ERROR = 'TASK_CONVERSION_ERROR',
  TASK_UNKNOWN_ERROR = 'TASK_UNKNOWN_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.DDB_RESOURCE_NOT_FOUND]: 'Resource not found in DynamoDB.',
  [ErrorCode.DDB_THROUGHPUT_EXCEEDED]:
    'Provisioned throughput for DynamoDB exceeded.',
  [ErrorCode.DDB_VALIDATION_ERROR]: 'Validation error in DynamoDB operation.',
  [ErrorCode.DDB_INTERNAL_SERVER_ERROR]: 'Internal server error in DynamoDB.',
  [ErrorCode.TASK_NOT_FOUND]: 'Task not found.',
  [ErrorCode.TASK_CONVERSION_ERROR]: 'Task conversion error.',
  [ErrorCode.TASK_UNKNOWN_ERROR]: 'Task unknown error.',
  [ErrorCode.UNKNOWN_ERROR]: 'Unknown error.',
  [ErrorCode.INVALID_REQUEST]: 'Invalid request provided.',
};

export const ERROR_HTTP_STATUS_CODES: Record<ErrorCode, HttpStatus> = {
  [ErrorCode.DDB_RESOURCE_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCode.DDB_THROUGHPUT_EXCEEDED]: HttpStatus.BAD_REQUEST,
  [ErrorCode.DDB_VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
  [ErrorCode.DDB_INTERNAL_SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCode.TASK_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCode.TASK_CONVERSION_ERROR]: HttpStatus.BAD_REQUEST,
  [ErrorCode.TASK_UNKNOWN_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCode.UNKNOWN_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCode.INVALID_REQUEST]: HttpStatus.BAD_REQUEST,
};

export const USER_ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.DDB_RESOURCE_NOT_FOUND]: 'The requested data could not be found.',
  [ErrorCode.DDB_THROUGHPUT_EXCEEDED]:
    'The system is currently busy. Please try again later.',
  [ErrorCode.DDB_VALIDATION_ERROR]: 'The provided data is invalid.',
  [ErrorCode.DDB_INTERNAL_SERVER_ERROR]:
    'We encountered an internal error. Please try again.',
  [ErrorCode.TASK_NOT_FOUND]: 'The requested task could not be found.',
  [ErrorCode.TASK_CONVERSION_ERROR]: 'Failed to process the task data.',
  [ErrorCode.TASK_UNKNOWN_ERROR]: 'An unexpected error occurred with the task.',
  [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
  [ErrorCode.INVALID_REQUEST]:
    'The provided request data is not valid. Please check and try again.',
};
