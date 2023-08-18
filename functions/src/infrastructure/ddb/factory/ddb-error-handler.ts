import { logger } from '../../../common/logger';
import {
  DdbClientError,
  DdbError,
  DdbServerError,
  DdbUnknownError,
} from '../errors/ddb-errors';

export const ddbErrorHandler = (error: Error): DdbError => {
  if (error instanceof DdbClientError) {
    logger.error('DynamoDB Client error:', error);
  } else if (error instanceof DdbServerError) {
    logger.error('DynamoDB Server error:', error);
  } else if (error instanceof DdbUnknownError) {
    logger.error('DynamoDB Unknown error:', error);
  } else {
    logger.error('DynamoDB Unknown error:', error);
    throw new DdbUnknownError('DynamoDB Unknown error', error);
  }
  throw error;
};
