export enum ErrorCode {
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',
  TASK_CONVERSION_ERROR = 'TASK_CONVERSION_ERROR',
  TASK_UNKNOWN_ERROR = 'TASK_UNKNOW_ERROR',
  DDB_CLIENT_ERROR = 'DDB_CLIENT_ERROR',
  DDB_SERVER_ERROR = 'DDB_SERVER_ERROR',
  DDB_UNKNOWN_ERROR = 'DDB_UNKNOWN_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNKNOWN_ERROR = 'UNKNOWN',
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.TASK_NOT_FOUND]: 'Task not found.',
  [ErrorCode.TASK_CONVERSION_ERROR]: 'Task conversion error.',
  [ErrorCode.TASK_UNKNOWN_ERROR]: 'Task unknown error.',
  [ErrorCode.DDB_CLIENT_ERROR]: 'DynamoDB client error.',
  [ErrorCode.DDB_SERVER_ERROR]: 'DynamoDB server error.',
  [ErrorCode.DDB_UNKNOWN_ERROR]: 'DynamoDB unknown error.',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error.',
  [ErrorCode.INVALID_REQUEST]: 'Invalid request.',
  [ErrorCode.UNKNOWN_ERROR]: 'Unknown error.',
};
