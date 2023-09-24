import { RepositoryAction } from '../../../usecases/base/contracts/base-contracts';
import { infraBaseFactory } from '../../base/factory/infra-base-factory';
import { DdbError } from '../errors/ddb-errors';
import { ddbErrorHandler } from './ddb-error-handler';

type DdbOpsErrorHandler = (error: Error) => DdbError;

export const ddbFactory = <T, P extends unknown[]>(
  name: string,
  operation: RepositoryAction<T, P>,
  errorHandler: DdbOpsErrorHandler = ddbErrorHandler,
): RepositoryAction<T, P> => {
  return infraBaseFactory(name, operation, errorHandler);
};
