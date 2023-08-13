import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DdbServerError } from './errors/ddb-errors';
import { logger } from '../../common/logger';
import { TaskRecord, TaskRecordSchema } from '../../domain/taskRecord';

const TABLE_NAME = process.env.TASKS_TABLE_NAME;
const AWS_REGION = process.env.AWS_REGION;
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

const dynamoDBClient = new DynamoDBClient({
  region: AWS_REGION,
  endpoint: DYNAMODB_ENDPOINT || undefined,
});

const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);

export const fetchTaskById = async (
  taskId: string,
): Promise<TaskRecord | null> => {
  try {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('DynamoDB error:', error);
    }
    throw new DdbServerError('DynamoDB error', error);
  }
};
