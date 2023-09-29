import { RepositoryAction } from '../../../usecases/base/contract/base-contracts';
import { infraFactory } from '../../base/factory/infra-factory';
import { CognitoError } from '../errors/cognito-errors';
import { cognitoErrorHandler } from './cognito-error-handler';

type CognitoOpsErrorHandler = (error: Error) => CognitoError;

export const cognitoFactory = <T, P extends unknown[]>(
  name: string,
  operation: RepositoryAction<T, P>,
  errorHandler: CognitoOpsErrorHandler = cognitoErrorHandler,
): RepositoryAction<T, P> => {
  return infraFactory(name, operation, errorHandler);
};