import {
  DdbError,
  DdbInternalServerError,
  DdbProvisionedThroughputExceededException,
  DdbResourceNotFoundError,
  DdbValidationException,
} from '../errors/ddb-errors';

export const ddbErrorHandler = (originalError: Error) => {
  switch (originalError.name) {
    case 'ResourceNotFoundException':
      throw new DdbResourceNotFoundError(originalError.message, originalError);
    case 'ProvisionedThroughputExceededException':
      throw new DdbProvisionedThroughputExceededException(
        originalError.message,
        originalError,
      );
    case 'ValidationException':
      throw new DdbValidationException(originalError.message, originalError);
    case 'InternalServerError':
      throw new DdbInternalServerError(originalError.message, originalError);
    default:
      throw new DdbError(originalError.message, originalError);
  }
};
