import {
  UseCase,
  UseCaseErrorHandler,
  useCaseFactory,
} from '../../base/factory/usecase-base-factory';
import { taskErrorHandler } from './task-error-handler';

export const taskUseCaseFactory = <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  errorHandler: UseCaseErrorHandler = taskErrorHandler,
): UseCase<T, P> => {
  return useCaseFactory(name, useCase, errorHandler);
};
