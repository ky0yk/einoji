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
      return await execute(name, operation, ...args);
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
  operation: RepositoryAction<T, P>,
  ...args: P
): Promise<T> => {
  logWrapper(name, 'ENTRY');
  const result = await operation(...args);
  logWrapper(name, 'EXIT');
  return result;
};

const handleError = (
  name: string,
  processError: OpsErrorHandler,
  error: Error,
): InfraError => {
  logErrorWrapper(name, 'ENTRY', error);
  const result = processError(error);
  logWrapper(name, 'EXIT');
  return result;
};

const handleUnexpectedError = (name: string, error: unknown): Error => {
  logErrorWrapper(name, 'ENTRY', error);
  const result = new Error('An unexpected error');
  logErrorWrapper(name, 'EXIT');
  return result;
};

const logWrapper = (name: string, action: string) =>
  logger.info(`${action} usecase: ${name}`);
const logErrorWrapper = (name: string, action: string, error?: unknown) =>
  logger.error(`${action} error in usecase: ${name}`, String(error));
