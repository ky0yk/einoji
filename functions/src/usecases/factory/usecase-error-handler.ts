import { AppError, ClientError, ServerError } from '../../common/app-errors';
import { ErrorCode } from '../../common/error-codes';
import {
  TaskConversionError,
  TaskNotFoundError,
  TaskUnknownError,
} from '../../domain/errors/task-errors';
import {
  DdbClientError,
  DdbServerError,
  DdbUnknownError,
} from '../../infrastructure/ddb/errors/ddb-errors';

export const useCaseErrorHandler = (error: Error): AppError => {
  if (error instanceof TaskNotFoundError) {
    return new ClientError(ErrorCode.TASK_NOT_FOUND, error);
  } else if (error instanceof TaskConversionError) {
    return new ServerError(ErrorCode.TASK_CONVERSION_ERROR, error);
  } else if (error instanceof TaskUnknownError) {
    return new ServerError(ErrorCode.TASK_UNKNOWN_ERROR, error);
  } else if (error instanceof DdbClientError) {
    return new ClientError(ErrorCode.DDB_CLIENT_ERROR, error);
  } else if (error instanceof DdbServerError) {
    return new ServerError(ErrorCode.DDB_SERVER_ERROR, error);
  } else if (error instanceof DdbUnknownError) {
    return new ServerError(ErrorCode.DDB_UNKNOWN_ERROR, error);
  } else {
    return new ServerError(ErrorCode.INTERNAL_SERVER_ERROR, error);
  }
};
