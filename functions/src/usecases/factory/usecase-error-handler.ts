import { AppError } from '../../common/errors/app-errors';
import { ErrorCode } from '../../common/errors/error-codes';
import {
  TaskError,
  TaskNotFoundError,
  TaskUpdateRuleError,
} from '../../domain/errors/task-errors';
import {
  DdbError,
  DdbInternalServerError,
  DdbProvisionedThroughputExceededError,
  DdbResourceNotFoundError,
  DdbValidationError,
} from '../../infrastructure/ddb/errors/ddb-errors';

export const useCaseErrorHandler = (error: DdbError | TaskError): AppError => {
  if (
    error instanceof DdbResourceNotFoundError ||
    error instanceof DdbProvisionedThroughputExceededError ||
    error instanceof DdbInternalServerError
  ) {
    return new AppError(
      ErrorCode.DATABASE_CONNECTION_ERROR,
      error.message,
      error,
    );
  }
  if (error instanceof DdbValidationError) {
    return new AppError(ErrorCode.INVALID_PAYLOAD_VALUE, error.message, error);
  }
  if (error instanceof TaskNotFoundError) {
    return new AppError(ErrorCode.TASK_NOT_FOUND, error.message, error);
  }
  if (error instanceof TaskUpdateRuleError) {
    return new AppError(ErrorCode.TASK_UPDATE_RULE_ERROR, error.message, error);
  }
  return new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error);
};
