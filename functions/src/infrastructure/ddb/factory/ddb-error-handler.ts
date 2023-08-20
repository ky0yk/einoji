import {
  DdbClientError,
  DdbError,
  DdbServerError,
  DdbUnknownError,
} from '../errors/ddb-errors';

export const ddbErrorHandler = (error: Error): DdbError => {
  if (error instanceof DdbClientError) {
    throw new DdbClientError('DynamoDB Client error', error);
  } else if (error instanceof DdbServerError) {
    throw new DdbServerError('DynamoDB Server error', error);
  } else {
    throw new DdbUnknownError('DynamoDB Unknown error', error);
  }
};
