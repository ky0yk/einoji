import {
  DdbError,
  DdbInternalServerError,
  DdbProvisionedThroughputExceededError,
  DdbResourceNotFoundError,
  DdbValidationError,
} from '../errors/ddb-errors';

export const ddbErrorHandler = (error: Error): DdbError => {
  switch (error.name) {
    case 'ResourceNotFoundException':
      throw new DdbResourceNotFoundError(error.message, error);
    case 'ProvisionedThroughputExceededException':
      throw new DdbProvisionedThroughputExceededError(error.message, error);
    case 'ValidationException':
      throw new DdbValidationError(error.message, error);
    default:
      throw new DdbInternalServerError(error.message, error);
  }
};
