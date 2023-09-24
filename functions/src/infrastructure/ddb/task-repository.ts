import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import { logger } from '../../common/logger';
import { DdbInternalServerError } from './errors/ddb-errors';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateTaskAction,
  CreateTaskPayload,
  DeleteTaskAction,
  FindTaskByIdAction,
  TaskRepository,
  UpdateTaskAtLeastOne,
  UpdateTaskAction,
} from '../../usecases/tasks/contracts/task-repository-contract';
import { Task } from '../../domain/task';
import { TaskItemSchema, toTask } from './schemas/task-item';
import { ddbFactory } from './factory/ddb-factory';

const TABLE_NAME = process.env.TASKS_TABLE_NAME;
const AWS_REGION = process.env.AWS_REGION;
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

const dynamoDBClient = new DynamoDBClient({
  region: AWS_REGION,
  endpoint: DYNAMODB_ENDPOINT,
});

const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);

const createTaskItem: CreateTaskAction = async (
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

const findTaskItemById: FindTaskByIdAction = async (
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

type DdbUpdateTaskAttributes = {
  updateExpression: string;
  expressionAttributeNames: { [key: string]: string };
  expressionAttributeValues: { [key: string]: string | number };
};

const buildUpdateTaskAttributes = (
  data: UpdateTaskAtLeastOne,
): DdbUpdateTaskAttributes => {
  const now = new Date().toISOString();

  const attributes = Object.entries(data).map(([key, value]) => ({
    key,
    value,
  }));
  const attributesWithTime = attributes.concat([
    { key: 'updatedAt', value: now },
  ]);

  const expressionParts = attributesWithTime.map(
    (attr) => `#${attr.key} = :${attr.key}`,
  );
  const expressionAttributeNames = Object.fromEntries(
    attributesWithTime.map((attr) => [`#${attr.key}`, attr.key]),
  );
  const expressionAttributeValues = Object.fromEntries(
    attributesWithTime.map((attr) => [`:${attr.key}`, attr.value]),
  );

  return {
    updateExpression: `SET ${expressionParts.join(', ')}`,
    expressionAttributeNames: expressionAttributeNames,
    expressionAttributeValues: expressionAttributeValues,
  };
};

const updateTaskItem: UpdateTaskAction = async (
  taskId: string,
  data: UpdateTaskAtLeastOne,
): Promise<Task> => {
  const {
    updateExpression: UpdateExpression,
    expressionAttributeNames: ExpressionAttributeNames,
    expressionAttributeValues: ExpressionAttributeValues,
  } = buildUpdateTaskAttributes(data);

  const commandInput = {
    TableName: TABLE_NAME,
    Key: {
      userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246', // fixme 認証を導入するまでは固定値を使う
      taskId: taskId,
    },
    UpdateExpression: UpdateExpression,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: ExpressionAttributeValues,
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

const deleteTaskItem: DeleteTaskAction = async (
  taskId: string,
): Promise<void> => {
  const commandInput: DeleteCommandInput = {
    TableName: TABLE_NAME,
    Key: {
      userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246', // fixme 認証を導入するまでは固定値を使う
      taskId: taskId,
    },
  };
  const command = new DeleteCommand(commandInput);
  await dynamoDb.send(command);
};

export const taskRepository: TaskRepository = {
  create: ddbFactory('taskRepository.create', createTaskItem),
  findById: ddbFactory('taskRepository.findById', findTaskItemById),
  update: ddbFactory('taskRepository.update', updateTaskItem),
  delete: ddbFactory('taskRepository.delete', deleteTaskItem),
};
