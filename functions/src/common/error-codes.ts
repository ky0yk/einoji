export enum ErrorCode {
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',
  DDB_CLIENT_ERROR = 'DDB_CLIENT_ERROR',
  DDB_SERVER_ERROR = 'DDB_SERVER_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.TASK_NOT_FOUND]: 'Task not found.',
  [ErrorCode.DDB_CLIENT_ERROR]: 'DynamoDB client error.',
  [ErrorCode.DDB_SERVER_ERROR]: 'DynamoDB server error.',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error.',
  [ErrorCode.INVALID_REQUEST]: 'Invalid request.',
};
