import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import {
  DdbClientError,
  DdbServerError,
  DdbUnknownError,
} from './errors/ddb-errors';
import { logger } from '../../common/logger';
import { TaskRecord, TaskRecordSchema } from '../../domain/taskRecord';
import { ddbFactory } from './utils/ddb-factory';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskRequest } from '../../domain/task';

const TABLE_NAME = process.env.TASKS_TABLE_NAME;
const AWS_REGION = process.env.AWS_REGION;
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

const dynamoDBClient = new DynamoDBClient({
  region: AWS_REGION,
  endpoint: DYNAMODB_ENDPOINT,
});

const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);

const createTaskImpl = async (body: CreateTaskRequest): Promise<string> => {
  const uuid = uuidv4();
  const now = new Date().toISOString();

  const putCommandInput: PutCommandInput = {
    TableName: TABLE_NAME,
    Item: {
      userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246', // fixme 認証を導入するまでは固定値を使う
      taskId: uuid,
      title: body.title,
      description: body.description ? body.description : '',
      completed: false,
      createdAt: now,
      updatedAt: now,
    },
  };
  const putCommand = new PutCommand(putCommandInput);
  const res = await dynamoDb.send(putCommand);
  checkHttpStatusCode(res);

  return uuid;
};

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
  checkHttpStatusCode(result);

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

const checkHttpStatusCode = (
  response: PutCommandOutput | GetCommandOutput,
): void => {
  const httpStatusCode = response?.$metadata?.httpStatusCode ?? null;

  if (httpStatusCode === null) {
    throw new DdbUnknownError('Invalid response or missing httpStatusCode');
  } else if (httpStatusCode >= 200 && httpStatusCode < 300) {
    return;
  } else if (httpStatusCode >= 400 && httpStatusCode < 500) {
    throw new DdbClientError('Bad Request');
  } else if (httpStatusCode >= 500 && httpStatusCode < 600) {
    throw new DdbServerError('Internal Server Error');
  } else {
    throw new DdbUnknownError('Unknown Error');
  }
};

export const createTask = ddbFactory('createTask', createTaskImpl);
export const fetchTaskById = ddbFactory('fetchTaskById', fetchTaskByIdImpl);

export const _testExports = {
  createTaskImpl,
  fetchTaskByIdImpl,
};
