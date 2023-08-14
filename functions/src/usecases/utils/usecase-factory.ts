import { AppError } from '../../common/app-errors';
import { logger } from '../../common/logger';

type UseCase<P, T> = (params: P) => Promise<T>;
type UseCaseErrorHandler = (error: Error) => AppError;

export const useCaseFactory = <P, T>(
  name: string,
  useCase: UseCase<P, T>,
  useCaseErrorHandler: UseCaseErrorHandler,
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
