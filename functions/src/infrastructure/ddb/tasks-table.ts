import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  PutCommandInput,
} from '@aws-sdk/lib-dynamodb';

import { logger } from '../../common/logger';
import { TaskItem, TaskItemSchema } from '../../domain/taskItem';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskRequest } from '../../handlers/http/requestSchemas/create-task-request';
import { ddbFactory } from './factory/ddb-factory';
import { DdbInternalServerError } from './errors/ddb-errors';

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
  await dynamoDb.send(putCommand);

  return uuid;
};

const fetchTaskByIdImpl = async (taskId: string): Promise<TaskItem | null> => {
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

export const createTask = ddbFactory('createTask', createTaskImpl);
export const fetchTaskById = ddbFactory('fetchTaskById', fetchTaskByIdImpl);
