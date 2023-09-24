import { RepositoryAction } from '../../../usecases/base/contracts/base-contracts';
import { infraBaseFactory } from '../../base/factory/infra-base-factory';
import { CognitoError } from '../errors/cognito-errors';
import { cognitoErrorHandler } from './cognito-error-handler';

type CognitoOpsErrorHandler = (error: Error) => CognitoError;

export const cognitoFactory = <T, P extends unknown[]>(
  name: string,
  operation: RepositoryAction<T, P>,
  errorHandler: CognitoOpsErrorHandler = cognitoErrorHandler,
): RepositoryAction<T, P> => {
  return infraBaseFactory(name, operation, errorHandler);
};
