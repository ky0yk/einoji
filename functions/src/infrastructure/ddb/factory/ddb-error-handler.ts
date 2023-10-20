import {
  DdbError,
  DdbInternalServerError,
  DdbValidationError,
} from '../errors/ddb-errors';

export const ddbErrorHandler = (error: Error): DdbError => {
  switch (error.name) {
    case 'ValidationException':
      return new DdbValidationError(error.message, error);
    case 'ResourceNotFoundException':
    case 'ProvisionedThroughputExceededException':
      return new DdbInternalServerError(error.message, error);
    default:
      return new DdbInternalServerError(error.message, error);
  }
};
