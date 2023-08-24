import {
  DdbInternalServerError,
  DdbProvisionedThroughputExceededError,
  DdbResourceNotFoundError,
  DdbValidationError,
} from '../errors/ddb-errors';

export const ddbErrorHandler = (originalError: Error) => {
  switch (originalError.name) {
    case 'ResourceNotFoundException':
      throw new DdbResourceNotFoundError(originalError.message, originalError);
    case 'ProvisionedThroughputExceededException':
      throw new DdbProvisionedThroughputExceededError(
        originalError.message,
        originalError,
      );
    case 'ValidationException':
      throw new DdbValidationError(originalError.message, originalError);
    default:
      throw new DdbInternalServerError(originalError.message, originalError);
  }
};
