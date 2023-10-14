import { InfraAction } from '../../../usecases/base/contract/base-contracts';
import { logger } from '../../../utils/logger';
import { InfraError } from '../errors/infra-errors';

type InfraErrorHandler = (error: Error) => InfraError;

export const infraFactory = <T, P extends unknown[]>(
  name: string,
  action: InfraAction<T, P>,
  errorHandler: InfraErrorHandler,
): InfraAction<T, P> => {
  return async (...args: P): Promise<T> => {
    try {
      return await executeAction(name, action, ...args);
    } catch (e: unknown) {
      if (e instanceof Error) {
        logger.error(`Raw error for ${name}:`, e);
        throw handleKnownError(name, errorHandler, e);
      }
      throw handleUnknownError(name, e);
    }
  };
};

const executeAction = async <T, P extends unknown[]>(
  name: string,
  operation: InfraAction<T, P>,
  ...args: P
): Promise<T> => {
  logWrapper(name, 'ENTRY');
  const result = await operation(...args);
  logWrapper(name, 'EXIT');
  return result;
};

const handleKnownError = (
  name: string,
  processError: InfraErrorHandler,
  error: Error,
): InfraError => {
  logErrorWrapper(name, 'ENTRY', error);
  const result = processError(error);
  logWrapper(name, 'EXIT');
  return result;
};

const handleUnknownError = (name: string, error: unknown): Error => {
  logErrorWrapper(name, 'ENTRY', error);
  const result = new Error('An unexpected error');
  logErrorWrapper(name, 'EXIT');
  return result;
};

const logWrapper = (name: string, action: string) =>
  logger.info(`${action} infra: ${name}`);
const logErrorWrapper = (name: string, action: string, error?: unknown) =>
  logger.error(`${action} error in infra: ${name}`, String(error));
