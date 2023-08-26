import { AppError } from '../../common/errors/app-errors';
import { ErrorCode } from '../../common/errors/error-codes';
import {
  TaskConversionError,
  TaskError,
  TaskNotFoundError,
  TaskUnknownError,
} from '../../domain/errors/task-errors';
import {
  DdbError,
  DdbInternalServerError,
  DdbProvisionedThroughputExceededError,
  DdbResourceNotFoundError,
  DdbValidationError,
} from '../../infrastructure/ddb/errors/ddb-errors';

export const useCaseErrorHandler = (error: DdbError | TaskError): AppError => {
  if (error instanceof DdbResourceNotFoundError) {
    return new AppError(
      ErrorCode.DDB_RESOURCE_NOT_FOUND,
      error.originalError?.message,
      error,
    );
  }
  if (error instanceof DdbProvisionedThroughputExceededError) {
    return new AppError(
      ErrorCode.DDB_THROUGHPUT_EXCEEDED,
      error.originalError?.message,
      error,
    );
  }
  if (error instanceof DdbValidationError) {
    return new AppError(
      ErrorCode.DDB_VALIDATION_ERROR,
      error.originalError?.message,
      error,
    );
  }
  if (error instanceof DdbInternalServerError) {
    return new AppError(
      ErrorCode.DDB_INTERNAL_SERVER_ERROR,
      error.originalError?.message,
      error,
    );
  }
  if (error instanceof TaskNotFoundError) {
    return new AppError(
      ErrorCode.TASK_NOT_FOUND,
      error.originalError?.message,
      error,
    );
  }
  if (error instanceof TaskConversionError) {
    return new AppError(
      ErrorCode.TASK_CONVERSION_ERROR,
      error.originalError?.message,
      error,
    );
  }
  if (error instanceof TaskUnknownError) {
    return new AppError(
      ErrorCode.TASK_UNKNOWN_ERROR,
      error.originalError?.message,
      error,
    );
  }
  return new AppError(
    ErrorCode.UNKNOWN_ERROR,
    error.originalError?.message,
    error,
  );
};
