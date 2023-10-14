import { AppError } from '../../../utils/errors/app-errors';
import { createLoggerFunctionsForLayer, logger } from '../../../utils/logger';
import { ErrorCode } from '../../../utils/errors/error-codes';

export type UseCase<T, P extends unknown[]> = (...args: P) => Promise<T>;
export type UseCaseErrorHandler = (error: Error) => AppError;

const { log, logError } = createLoggerFunctionsForLayer('USECASE');

export const useCaseFactory = <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  errorHandler: UseCaseErrorHandler,
): UseCase<T, P> => {
  return async (...args: P): Promise<T> => {
    try {
      return await executeUseCase(name, useCase, ...args);
    } catch (e: unknown) {
      if (e instanceof Error) {
        logger.error(`Raw error for ${name}:`, e);
        throw handleKnownError(name, errorHandler, e);
      }
      throw handleUnknownError(name, e);
    }
  };
};

const executeUseCase = async <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  ...args: P
): Promise<T> => {
  log('ENTRY', name);
  const result = await useCase(...args);
  log('EXIT', name);
  return result;
};

const handleKnownError = (
  name: string,
  errorHandler: UseCaseErrorHandler,
  error: Error,
): AppError => {
  logError('ENTRY', name, error);
  const result = errorHandler(error);
  log('EXIT', name);
  return result;
};

const handleUnknownError = (name: string, error: unknown): AppError => {
  logError('ENTRY', name, error);
  const result = new AppError(ErrorCode.UNKNOWN_ERROR, 'An unexpected error');
  logError('EXIT', name);
  return result;
};
