import { InfraAction } from '../../../usecases/base/contract/base-contracts';
import { createLoggerFunctionsForLayer, logger } from '../../../utils/logger';
import { InfraError } from '../errors/infra-errors';

type InfraErrorHandler = (error: Error) => InfraError;

const { log, logError } = createLoggerFunctionsForLayer('INFRA');

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
  log('ENTRY', name);
  const result = await operation(...args);
  log('EXIT', name);
  return result;
};

const handleKnownError = (
  name: string,
  processError: InfraErrorHandler,
  error: Error,
): InfraError => {
  logError('ENTRY', name, error);
  const result = processError(error);
  log('EXIT', name);
  return result;
};

const handleUnknownError = (name: string, error: unknown): Error => {
  logError('ENTRY', name, error);
  const result = new Error('An unexpected error');
  logError('EXIT', name);
  return result;
};
