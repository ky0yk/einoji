import { logger } from '../../common/logger';
import { RepositoryAction } from '../../usecases/contracts/base-contracts';

type OpsErrorHandler = (error: Error) => Error;

export const infraBaseFactory = <T, P extends unknown[]>(
  name: string,
  operation: RepositoryAction<T, P>,
  errorHandler: OpsErrorHandler,
): RepositoryAction<T, P> => {
  return async (...args: P): Promise<T> => {
    try {
      return await operationWithLog(name, operation, ...args);
    } catch (e: unknown) {
      return await operationErrorHandlerWithLog(name, errorHandler, e);
    }
  };
};

const operationWithLog = async <T, P extends unknown[]>(
  name: string,
  operation: RepositoryAction<T, P>,
  ...args: P
): Promise<T> => {
  logger.info(`ENTRY Operation: ${name}`);
  const result = await operation(...args);
  logger.info(`EXIT Operation: ${name}`);
  return result;
};

const operationErrorHandlerWithLog = async <T>(
  name: string,
  processError: OpsErrorHandler,
  e: unknown,
): Promise<T> => {
  logger.error(`An error occurred in Operation: ${name}`);
  if (e instanceof Error) {
    logger.error(`ENTRY Operation error handling: ${name}`);
    const errorResult = processError(e);
    logger.info(`EXIT Operation error handling: ${name}`, errorResult);
    throw errorResult;
  } else {
    logger.error(`unexpected error occurred in Operation: ${name}}`);
    throw new Error('Unknown error');
  }
};
