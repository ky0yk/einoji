import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

import { logger } from '../../common/logger';
import { ddbFactory } from './factory/ddb-factory';
import { DdbInternalServerError } from './errors/ddb-errors';
import { TaskItem, TaskItemSchema } from '../../domain/taskItem';

const TABLE_NAME = process.env.TASKS_TABLE_NAME;
const AWS_REGION = process.env.AWS_REGION;
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

const dynamoDBClient = new DynamoDBClient({
  region: AWS_REGION,
  endpoint: DYNAMODB_ENDPOINT,
});

const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);

const getTaskItemByIdImpl = async (
  taskId: string,
): Promise<TaskItem | null> => {
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

  const parseResult = TaskItemSchema.safeParse(result.Item);
  if (!parseResult.success) {
    throw new DdbInternalServerError(
      'Retrieved item does not match the expected schema',
      parseResult.error,
    );
  }

  return parseResult.data;
};

export const getTaskItemById = ddbFactory(
  'getTaskItemById',
  getTaskItemByIdImpl,
);
