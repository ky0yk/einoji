import { logger } from '../../../common/logger';
import {
  DdbClientError,
  DdbError,
  DdbServerError,
  DdbUnknownError,
} from '../errors/ddb-errors';

type ddbOperation<P, T> = (params: P) => Promise<T>;
type ddbOperationErrorHandler = (error: Error) => DdbError;

export const ddbFactory = <P, T>(
  name: string,
  ddbOperation: ddbOperation<P, T>,
  ddbOperationErrorHandler: ddbOperationErrorHandler = defaultErrorHandler,
): ddbOperation<P, T> => {
  return async (params: P) => {
    try {
      return await ddbOperationWithLog(name, ddbOperation, params);
    } catch (e: unknown) {
      return await ddbOperationErrorHandlerWithLog(
        name,
        ddbOperationErrorHandler,
        e,
      );
    }
  };
};

const ddbOperationWithLog = async <P, T>(
  name: string,
  useCase: ddbOperation<P, T>,
  params: P,
): Promise<T> => {
  logger.info(`START Dynamodb Operation: ${name}`);
  const result = await useCase(params);
  logger.info(`EXIT Dynamodb Operation: ${name}`);
  return result;
};

const ddbOperationErrorHandlerWithLog = async <T>(
  name: string,
  processError: ddbOperationErrorHandler,
  e: unknown,
): Promise<T> => {
  logger.error(`An error occurred in Dynamodb Operation: ${name}`);
  if (e instanceof Error) {
    logger.error(`START Dynamodb Operation error handling: ${name}`);
    const errorResult = processError(e);
    logger.info(`EXIT Dynamodb Operation error handling: ${name}`, errorResult);
    throw errorResult;
  } else {
    logger.info(`unexpected error occurred in Dynamodb Operation: ${name}}`);
    throw new Error('Unknown error');
  }
};

// 再スローするだけのデフォルトのエラーハンドラ
const defaultErrorHandler = (error: Error): DdbError => {
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
