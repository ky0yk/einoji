import {
  UseCase,
  UseCaseErrorHandler,
  useCaseFactory,
} from '../../base/factory/usecase-base-factory';
import { userErrorHandler } from './user-error-handler';

export const userUseCaseFactory = <T, P extends unknown[]>(
  name: string,
  useCase: UseCase<T, P>,
  errorHandler: UseCaseErrorHandler = userErrorHandler,
): UseCase<T, P> => {
  return useCaseFactory(name, useCase, errorHandler);
};
