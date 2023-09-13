import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import { logger } from '../../common/logger';
import { ddbFactory } from './factory/ddb-factory';
import { DdbInternalServerError } from './errors/ddb-errors';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateTaskCommand,
  CreateTaskPayload,
  GetTaskCommand,
  TaskRepository,
  TaskUpdateAtLeastOne,
  UpdateTaskCommand,
} from '../../usecases/contracts/task-repository-contract';
import { Task } from '../../domain/task';
import { TaskItemSchema, toTask } from './schemas/task-item';

const TABLE_NAME = process.env.TASKS_TABLE_NAME;
const AWS_REGION = process.env.AWS_REGION;
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

const dynamoDBClient = new DynamoDBClient({
  region: AWS_REGION,
  endpoint: DYNAMODB_ENDPOINT,
});

const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);

const createTaskItemImpl: CreateTaskCommand = async (
  body: CreateTaskPayload,
): Promise<string> => {
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

const getTaskItemByIdImpl: GetTaskCommand = async (
  taskId: string,
): Promise<Task | null> => {
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
    logger.warn(`Task with TaskId ${taskId} not found.`);
    return null;
  }

  const parseResult = TaskItemSchema.safeParse(result.Item);
  if (!parseResult.success) {
    throw new DdbInternalServerError(
      `Retrieved item does not match the expected schema. TaskId: ${taskId}`,
      parseResult.error,
    );
  }

  return toTask(parseResult.data);
};

const updateTaskItemByIdImpl: UpdateTaskCommand = async (
  taskId: string,
  data: TaskUpdateAtLeastOne,
): Promise<Task> => {
  const now = new Date().toISOString();

  const updateExpression = [
    'set',
    data.title ? '#title = :title,' : '',
    data.description ? '#description = :description,' : '',
    '#updatedAt = :updatedAt',
  ]
    .filter(Boolean)
    .join(' ');

  const expressionAttributeNames = {
    ...(data.title && { '#title': 'title' }),
    ...(data.description && { '#description': 'description' }),
    '#updatedAt': 'updatedAt',
  };

  const expressionAttributeValues = {
    ...(data.title && { ':title': data.title }),
    ...(data.description && { ':description': data.description }),
    ':updatedAt': now,
  };

  const commandInput = {
    TableName: TABLE_NAME,
    Key: {
      userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246', // fixme 認証を導入するまでは固定値を使う
      taskId: taskId,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };
  const command = new UpdateCommand(commandInput);
  const result = await dynamoDb.send(command);

  const parseResult = TaskItemSchema.safeParse(result.Attributes);
  if (!parseResult.success) {
    throw new DdbInternalServerError(
      `Retrieved item does not match the expected schema. TaskId: ${taskId}`,
      parseResult.error,
    );
  }

  return toTask(parseResult.data);
};

export const taskRepository: TaskRepository = {
  create: ddbFactory('taskRepository.create', createTaskItemImpl),
  getById: ddbFactory('taskRepository.getById', getTaskItemByIdImpl),
  update: ddbFactory('taskRepository.update', updateTaskItemByIdImpl),
};
