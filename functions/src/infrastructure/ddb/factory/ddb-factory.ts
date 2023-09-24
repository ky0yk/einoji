import { RepositoryAction } from '../../../usecases/base/contract/base-contracts';
import { baseInfraFactory } from '../../base/factory/base-infra-factory';
import { DdbError } from '../errors/ddb-errors';
import { ddbErrorHandler } from './ddb-error-handler';

type DdbOpsErrorHandler = (error: Error) => DdbError;

export const ddbFactory = <T, P extends unknown[]>(
  name: string,
  operation: RepositoryAction<T, P>,
  errorHandler: DdbOpsErrorHandler = ddbErrorHandler,
): RepositoryAction<T, P> => {
  return baseInfraFactory(name, operation, errorHandler);
};
