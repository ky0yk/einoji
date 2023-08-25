import { ErrorCode } from './error-codes';

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string = ERROR_MESSAGES[code],
    public originalError?: Error,
  ) {
    super(message);
  }
}

const ERROR_MESSAGES: Record<ErrorCode, string> = {
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
