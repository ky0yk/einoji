import { InfraAction } from '../../../usecases/base/contract/base-contracts';
import { infraFactory } from '../../base/factory/infra-factory';
import { CognitoError } from '../errors/cognito-errors';
import { cognitoErrorHandler } from './cognito-error-handler';

type CognitoOpsErrorHandler = (error: Error) => CognitoError;

export const cognitoFactory = <T, P extends unknown[]>(
  name: string,
  operation: InfraAction<T, P>,
  errorHandler: CognitoOpsErrorHandler = cognitoErrorHandler,
): InfraAction<T, P> => {
  return infraFactory(name, operation, errorHandler);
};
