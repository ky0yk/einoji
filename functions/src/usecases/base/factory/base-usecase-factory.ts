import { AppError } from '../../../utils/errors/app-errors';
import { logger } from '../../../utils/logger';
import { taskUsecaseErrorHandler } from '../../tasks/factory/task-usecase-error-handler';

type UseCase<T, P extends unknown[]> = (...args: P) => Promise<T>;
type UseCaseErrorHandler = (error: Error) => AppError;

export const baseUsecaseFactory = <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  errorHandler: UseCaseErrorHandler = taskUsecaseErrorHandler,
): UseCase<T, P> => {
  return async (...args: P): Promise<T> => {
    try {
      return await usecaseWithLog(name, useCase, ...args);
    } catch (e: unknown) {
      return await usecaseErrorHandlerWithLog(name, errorHandler, e);
    }
  };
};

const usecaseWithLog = async <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  ...args: P
): Promise<T> => {
  logger.info(`ENTRY usecase: ${name}`);
  const result = await useCase(...args);
  logger.info(`EXIT usecase: ${name}`);
  return result;
};

const usecaseErrorHandlerWithLog = async <T>(
  name: string,
  processError: UseCaseErrorHandler,
  e: unknown,
): Promise<T> => {
  logger.error(`An error occurred in usecase: ${name}`);
  if (e instanceof Error) {
    logger.error(`ENTRY usecase error handling: ${name}`);
    const errorResult = processError(e);
    logger.info(`EXIT usecase error handling: ${name}`, errorResult);
    throw errorResult;
  } else {
    logger.info(`unexpected error occurred in usecase: ${name}`);
    throw new Error('Unknown error');
  }
};
