import { AppError } from '../../common/errors/app-errors';
import { logger } from '../../common/logger';
import { useCaseErrorHandler } from './usecase-error-handler';

type UseCase<T, P extends unknown[]> = (...args: P) => Promise<T>;
type UseCaseErrorHandler = (error: Error) => AppError;

export const useCaseFactory = <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  errorHandler: UseCaseErrorHandler = useCaseErrorHandler,
): UseCase<T, P> => {
  return async (...args: P): Promise<T> => {
    try {
      return await useCaseWithLog(name, useCase, ...args);
    } catch (e: unknown) {
      return await useCaseErrorHandlerWithLog(name, errorHandler, e);
    }
  };
};

const useCaseWithLog = async <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  ...args: P
): Promise<T> => {
  logger.info(`ENTRY usecase: ${name}`);
  const result = await useCase(...args);
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
    logger.error(`ENTRY usecase error handling: ${name}`);
    const errorResult = processError(e);
    logger.info(`EXIT usecase error handling: ${name}`, errorResult);
    throw errorResult;
  } else {
    logger.info(`unexpected error occurred in usecase: ${name}`);
    throw new Error('Unknown error');
  }
};
