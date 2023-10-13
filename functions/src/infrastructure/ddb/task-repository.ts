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

import { logger } from '../../utils/logger';
import { ddbFactory } from './factory/ddb-factory';
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
} from '../../usecases/tasks/contracts/task-repository-contracts';
import { Task } from '../../domain/task/task';
import { TaskItemSchema, toTask } from './schemas/task-item';

const TABLE_NAME = process.env.TASKS_TABLE_NAME;
const AWS_REGION = process.env.AWS_REGION;
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT;

const dynamoDBClient = new DynamoDBClient({
  region: AWS_REGION,
  endpoint: DYNAMODB_ENDPOINT,
});

const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);

const createTaskItem: CreateTaskAction = async (
  userId: string,
  body: CreateTaskPayload,
): Promise<string> => {
  const uuid = uuidv4();
  const now = new Date().toISOString();

  const putCommandInput: PutCommandInput = {
    TableName: TABLE_NAME,
    Item: {
      userId: userId,
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
  userId: string,
  taskId: string,
): Promise<Task | null> => {
  const commandInput = {
    TableName: TABLE_NAME,
    Key: {
      userId: userId,
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
  userId: string,
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
      userId: userId,
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
  userId: string,
  taskId: string,
): Promise<void> => {
  const commandInput: DeleteCommandInput = {
    TableName: TABLE_NAME,
    Key: {
      userId: userId,
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
