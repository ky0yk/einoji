import { RepositoryAction } from '../../../usecases/base/contract/base-contracts';
import { logger } from '../../../utils/logger';
import { InfraError } from '../errors/infra-errors';

type OpsErrorHandler = (error: Error) => InfraError;

export const infraFactory = <T, P extends unknown[]>(
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
  logger.info(`ENTRY infra: ${name}`);
  const result = await operation(...args);
  logger.info(`EXIT infra: ${name}`);
  return result;
};

const operationErrorHandlerWithLog = async <T>(
  name: string,
  processError: OpsErrorHandler,
  e: unknown,
): Promise<T> => {
  logger.error(`An error occurred in infra: ${name}`);
  if (e instanceof Error) {
    logger.error(`ENTRY Operation error handling: ${name}`);
    const errorResult = processError(e);
    logger.info(`EXIT Operation error handling: ${name}`, errorResult);
    throw errorResult;
  } else {
    logger.error(`unexpected error occurred in infra: ${name}}`);
    throw new Error('Unknown error');
  }
};
