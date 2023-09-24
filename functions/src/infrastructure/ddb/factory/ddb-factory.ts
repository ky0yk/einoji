import { RepositoryAction } from '../../../usecases/tasks/contracts/task-repository-contract';
import { infraBaseFactory } from '../../factory/infra-base-factory';
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
