import {
  UseCase,
  UseCaseErrorHandler,
  useCaseFactory,
} from '../../base/factory/usecase-factory';
import { userUsecaseErrorHandler } from './user-usecase-error-handler';

export const userUseCaseFactory = <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  errorHandler: UseCaseErrorHandler = userUsecaseErrorHandler,
): UseCase<T, P> => {
  return useCaseFactory(name, useCase, errorHandler);
};
