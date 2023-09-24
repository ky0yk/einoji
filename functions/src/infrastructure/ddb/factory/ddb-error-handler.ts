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
      return new DdbResourceNotFoundError(error.message, error);
    case 'ProvisionedThroughputExceededException':
      return new DdbProvisionedThroughputExceededError(error.message, error);
    case 'ValidationException':
      return new DdbValidationError(error.message, error);
    default:
      return new DdbInternalServerError(error.message, error);
  }
};
