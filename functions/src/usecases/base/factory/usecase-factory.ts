import { AppError } from '../../../utils/errors/app-errors';
import { logger } from '../../../utils/logger';
import { taskUsecaseErrorHandler } from '../../tasks/factory/task-usecase-error-handler';
import { ErrorCode } from '../../../utils/errors/error-codes';

export type UseCase<T, P extends unknown[]> = (...args: P) => Promise<T>;
export type UseCaseErrorHandler = (error: Error) => AppError;

export const usecaseFactory = <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  errorHandler: UseCaseErrorHandler = taskUsecaseErrorHandler,
): UseCase<T, P> => {
  return async (...args: P): Promise<T> => {
    try {
      return await execute(name, useCase, ...args);
    } catch (e: unknown) {
      if (e instanceof Error) {
        logger.error(`Raw error for ${name}:`, e);
        throw handleError(name, errorHandler, e);
      }
      throw handleUnexpectedError(name, e);
    }
  };
};

const execute = async <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  ...args: P
): Promise<T> => {
  logWrapper(name, 'ENTRY');
  const result = await useCase(...args);
  logWrapper(name, 'EXIT');
  return result;
};

const handleError = (
  name: string,
  errorHandler: UseCaseErrorHandler,
  error: Error,
): AppError => {
  logErrorWrapper(name, 'ENTRY', error);
  const result = errorHandler(error);
  logWrapper(name, 'EXIT');
  return result;
};

const handleUnexpectedError = (name: string, error: unknown): AppError => {
  logErrorWrapper(name, 'ENTRY', error);
  const result = new AppError(ErrorCode.UNKNOWN_ERROR, 'An unexpected error');
  logErrorWrapper(name, 'EXIT');
  return result;
};

const logWrapper = (name: string, action: string) =>
  logger.info(`${action} usecase: ${name}`);
const logErrorWrapper = (name: string, action: string, error?: unknown) =>
  logger.error(`${action} error in usecase: ${name}`, String(error));
