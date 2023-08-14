import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DdbError, DdbServerError } from './errors/ddb-errors';
import { logger } from '../../common/logger';
import { TaskRecord, TaskRecordSchema } from '../../domain/taskRecord';
import { ddbFactory } from './utils/ddb-factory';

const TABLE_NAME = process.env.TASKS_TABLE_NAME;
const AWS_REGION = process.env.AWS_REGION;
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

const dynamoDBClient = new DynamoDBClient({
  region: AWS_REGION,
  endpoint: DYNAMODB_ENDPOINT,
});

const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);

const fetchTaskByIdImpl = async (
  taskId: string,
): Promise<TaskRecord | null> => {
  const commandInput = {
    TableName: TABLE_NAME,
    Key: {
      userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246', // fixme 認証を導入するまでは固定値を使う
      taskId: taskId,
    },
  };
  const command = new GetCommand(commandInput);
  const result = await dynamoDb.send(command);

  if (!result.Item) {
    logger.warn(`Task with taskId ${taskId} not found.`);
    return null;
  }

  const parseResult = TaskRecordSchema.safeParse(result.Item);
  if (!parseResult.success) {
    throw new DdbServerError(
      'Retrieved item does not match the expected schema',
      parseResult.error,
    );
  }

  return parseResult.data;
};

const errorHandler = (error: Error): DdbError => {
  if (error instanceof DdbServerError) {
    logger.error('DynamoDB Server error:', error);
    throw error;
  } else {
    logger.error('DynamoDB Unknown error:');
    throw new DdbError('DynamoDB Unknown error');
  }
};

export const fetchTaskById = ddbFactory(
  'fetchTaskById',
  fetchTaskByIdImpl,
  errorHandler,
);

export const _testExports = {
  fetchTaskByIdImpl,
  errorHandler,
};
