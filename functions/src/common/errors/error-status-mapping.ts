import { HttpStatus } from '../../handlers/http/http-status';
import { ErrorCode } from './error-codes';

export const ERROR_HTTP_STATUS_CODES: Record<ErrorCode, HttpStatus> = {
  [ErrorCode.DDB_RESOURCE_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCode.DDB_THROUGHPUT_EXCEEDED]: HttpStatus.TOO_MANY_REQUESTS,
  [ErrorCode.DDB_VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
  [ErrorCode.DDB_INTERNAL_SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCode.TASK_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCode.TASK_CONVERSION_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCode.TASK_UNKNOWN_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCode.UNKNOWN_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  [ErrorCode.INVALID_REQUEST]: HttpStatus.BAD_REQUEST,
};
