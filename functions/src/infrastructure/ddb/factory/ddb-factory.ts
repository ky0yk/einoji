import { logger } from '../../../common/logger';
import { RepoCommand } from '../../../usecases/contracts/task-repository-contract';
import { DdbError } from '../errors/ddb-errors';
import { ddbErrorHandler } from './ddb-error-handler';

type DdbOpsErrorHandler = (error: Error) => DdbError;

export const ddbFactory = <T, P extends unknown[]>(
  name: string,
  ddbOperation: RepoCommand<T, P>,
  errorHandler: DdbOpsErrorHandler = ddbErrorHandler,
): RepoCommand<T, P> => {
  return async (...args: P): Promise<T> => {
    try {
      return await ddbOperationWithLog(name, ddbOperation, ...args);
    } catch (e: unknown) {
      return await ddbOperationErrorHandlerWithLog(name, errorHandler, e);
    }
  };
};

const ddbOperationWithLog = async <T, P extends unknown[]>(
  name: string,
  operation: RepoCommand<T, P>,
  ...args: P
): Promise<T> => {
  logger.info(`START Dynamodb Operation: ${name}`);
  const result = await operation(...args);
  logger.info(`EXIT Dynamodb Operation: ${name}`);
  return result;
};

const ddbOperationErrorHandlerWithLog = async <T>(
  name: string,
  processError: DdbOpsErrorHandler,
  e: unknown,
): Promise<T> => {
  logger.error(`An error occurred in Dynamodb Operation: ${name}`);
  if (e instanceof Error) {
    logger.error(`START Dynamodb Operation error handling: ${name}`);
    const errorResult = processError(e);
    logger.info(`EXIT Dynamodb Operation error handling: ${name}`, errorResult);
    throw errorResult;
  } else {
    logger.error(`unexpected error occurred in Dynamodb Operation: ${name}}`);
    throw new Error('Unknown error');
  }
};
