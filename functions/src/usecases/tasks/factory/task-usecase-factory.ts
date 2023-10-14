import { AppError } from '../../../utils/errors/app-errors';
import { useCaseFactory } from '../../base/factory/usecase-factory';
import { taskUsecaseErrorHandler } from './task-usecase-error-handler';

type UseCase<T, P extends unknown[]> = (...args: P) => Promise<T>;
type UseCaseErrorHandler = (error: Error) => AppError;

export const taskUsecaseFactory = <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  errorHandler: UseCaseErrorHandler = taskUsecaseErrorHandler,
): UseCase<T, P> => {
  return useCaseFactory(name, useCase, errorHandler);
};
