import { AppError } from '../../../utils/errors/app-errors';
import { baseUsecaseFactory } from '../../base/factory/base-usecase-factory';
import { taskUsecaseErrorHandler } from './task-usecase-error-handler';

type UseCase<T, P extends unknown[]> = (...args: P) => Promise<T>;
type UseCaseErrorHandler = (error: Error) => AppError;

export const taskUsecaseFactory = <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  errorHandler: UseCaseErrorHandler = taskUsecaseErrorHandler,
): UseCase<T, P> => {
  return baseUsecaseFactory(name, useCase, errorHandler);
};
