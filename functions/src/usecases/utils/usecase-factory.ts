import { AppError, ClientError, ServerError } from '../../common/app-errors';
import { ErrorCode } from '../../common/error-codes';
import { logger } from '../../common/logger';
import {
  DdbClientError,
  DdbServerError,
  DdbUnknownError,
} from '../../infrastructure/ddb/errors/ddb-errors';
import {
  TaskConversionError,
  TaskNotFoundError,
  TaskUnknownError,
} from '../../domain/errors/task-errors';

type UseCase<P, T> = (params: P) => Promise<T>;
type UseCaseErrorHandler = (error: Error) => AppError;

export const useCaseFactory = <P, T>(
  name: string,
  useCase: UseCase<P, T>,
  useCaseErrorHandler: UseCaseErrorHandler = defaultErrorHandler,
): UseCase<P, T> => {
  return async (params: P) => {
    try {
      return await useCaseWithLog(name, useCase, params);
    } catch (e: unknown) {
      return await useCaseErrorHandlerWithLog(name, useCaseErrorHandler, e);
    }
  };
};

const useCaseWithLog = async <P, T>(
  name: string,
  useCase: UseCase<P, T>,
  params: P,
): Promise<T> => {
  logger.info(`START usecase: ${name}`);
  const result = await useCase(params);
  logger.info(`EXIT usecase: ${name}`);
  return result;
};

const useCaseErrorHandlerWithLog = async <T>(
  name: string,
  processError: UseCaseErrorHandler,
  e: unknown,
): Promise<T> => {
  logger.error(`An error occurred in usecase: ${name}`);
  if (e instanceof Error) {
    logger.error(`START usecase error handling: ${name}`);
    const errorResult = processError(e);
    logger.info(`EXIT usecase error handling: ${name}`, errorResult);
    throw errorResult;
  } else {
    logger.info(`unexpected error occurred in usecase: ${name}}`);
    throw new Error('Unknown error');
  }
};

const defaultErrorHandler = (error: Error): AppError => {
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
