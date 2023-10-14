import { InfraAction } from '../../../usecases/base/contract/base-contracts';
import { infraFactory } from '../../base/factory/infra-factory';
import { DdbError } from '../errors/ddb-errors';

import { ddbErrorHandler } from './ddb-error-handler';

type DdbOpsErrorHandler = (error: Error) => DdbError;

export const ddbFactory = <T, P extends unknown[]>(
  name: string,
  operation: InfraAction<T, P>,
  errorHandler: DdbOpsErrorHandler = ddbErrorHandler,
): InfraAction<T, P> => {
  return infraFactory(name, operation, errorHandler);
};
