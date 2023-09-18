import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { DdbInternalServerError } from '../../../../src/infrastructure/ddb/errors/ddb-errors';
import { taskRepository } from '../../../../src/infrastructure/ddb/task-repository';
import { TaskItem } from '../../../../src/infrastructure/ddb/schemas/task-item';
import { z } from 'zod';
import { Task } from '../../../../src/domain/task';

const documentMockClient = mockClient(DynamoDBDocumentClient);
const TASK_TABLE_NAME = process.env.TASKS_TABLE_NAME;

describe('taskRepository.create', () => {
  afterEach(() => {
    documentMockClient.reset();
  });
  const UuidSchema = z.string().uuid();

  test('should return a generated UUID when creating a task with a title and description', async () => {
    const taskBody = { title: 'Test Task', description: 'Test Description' };
    documentMockClient.on(PutCommand).resolves({});

    const createdTaskId = await taskRepository.create(taskBody);

    const callsOfPut = documentMockClient.commandCalls(PutCommand);
    expect(callsOfPut).toHaveLength(1);
    expect(callsOfPut[0].args[0].input).toEqual({
      TableName: TASK_TABLE_NAME,
      Item: {
        userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
        taskId: expect.any(String),
        title: taskBody.title,
        description: taskBody.description,
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
    const parseResult = UuidSchema.safeParse(createdTaskId);
    expect(parseResult.success).toBe(true);
  });

  test('should return a generated UUID when creating a task with only a title', async () => {
    const taskBody = { title: 'Test Task' };
    documentMockClient.on(PutCommand).resolves({});

    const createdTaskId = await taskRepository.create(taskBody);

    const callsOfPut = documentMockClient.commandCalls(PutCommand);
    expect(callsOfPut).toHaveLength(1);
    expect(callsOfPut[0].args[0].input).toEqual({
      TableName: TASK_TABLE_NAME,
      Item: {
        userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
        taskId: expect.any(String),
        title: taskBody.title,
        description: '',
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
    const parseResult = UuidSchema.safeParse(createdTaskId);
    expect(parseResult.success).toBe(true);
  });
});

describe('taskRepository.getById', () => {
  beforeEach(() => {
    documentMockClient.reset();
  });

  const dummyTaskId = '1a7244c5-06d3-47e2-560e-f0b5534c8246';

  test('should return a TaskItem for a valid task ID', async () => {
    const dummyTaskItem: TaskItem = {
      userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
      taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
      title: 'スーパーに買い物に行く',
      completed: false,
      description: '牛乳と卵を買う',
      createdAt: '2021-06-22T14:24:02.071Z',
      updatedAt: '2021-06-22T14:24:02.071Z',
    };
    const dummyTask: Task = {
      id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
      title: 'スーパーに買い物に行く',
      completed: false,
      description: '牛乳と卵を買う',
      createdAt: '2021-06-22T14:24:02.071Z',
      updatedAt: '2021-06-22T14:24:02.071Z',
    };

    documentMockClient.on(GetCommand).resolves({ Item: dummyTaskItem });

    const result = await taskRepository.getById(dummyTaskId);

    const callsOfGet = documentMockClient.commandCalls(GetCommand);
    expect(callsOfGet).toHaveLength(1);
    expect(callsOfGet[0].args[0].input).toEqual({
      TableName: TASK_TABLE_NAME,
      Key: {
        userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
        taskId: dummyTaskId,
      },
    });
    expect(result).toEqual(dummyTask);
  });

  test('should return null if the task is not found', async () => {
    documentMockClient.on(GetCommand).resolves({});
    const task = await taskRepository.getById('some-task-id');

    expect(task).toBeNull();
    expect(documentMockClient.calls()).toHaveLength(1);
  });

  test('should throw an error if the retrieved item does not match the schema', async () => {
    const invalidTaskItem = {
      invalidField: 'invalidValue',
    };

    documentMockClient.on(GetCommand).resolves({ Item: invalidTaskItem });
    await expect(taskRepository.getById(dummyTaskId)).rejects.toThrow(
      DdbInternalServerError,
    );
    expect(documentMockClient.calls()).toHaveLength(1);
  });
});

describe('taskRepository.update', () => {
  beforeEach(() => {
    documentMockClient.reset();
  });

  const userId = '1a7244c5-06d3-47e2-560e-f0b5534c8246';
  const taskId = 'f0f8f5a0-309d-11ec-8d3d-0242ac130003';
  const updatedAt = '2023-09-11T12:35:45.123Z';

  const tests = [
    {
      name: 'should generate correct update expression when both title and description are provided',
      input: {
        title: '新しいタイトル',
        description: '新しい説明',
      },
      mockedReturnValue: {
        userId: userId,
        taskId: taskId,
        title: '新しいタイトル',
        completed: false,
        description: '新しい説明',
        createdAt: '2021-06-22T14:24:02.071Z',
        updatedAt: updatedAt,
      },
      expectedUpdateExpression:
        'SET #title = :title, #description = :description, #updatedAt = :updatedAt',
      expectedExpressionAttributeNames: {
        '#title': 'title',
        '#description': 'description',
        '#updatedAt': 'updatedAt',
      },
      expectedExpressionAttributeValues: {
        ':title': '新しいタイトル',
        ':description': '新しい説明',
        ':updatedAt': expect.any(String),
      },
      expectedTask: {
        id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
        completed: false,
        createdAt: '2021-06-22T14:24:02.071Z',
        description: '新しい説明',
        title: '新しいタイトル',
        updatedAt: expect.any(String),
      },
    },
    {
      name: 'should generate correct update expression when only title is provided',
      input: {
        title: '新しいタイトル',
      },
      mockedReturnValue: {
        userId: userId,
        taskId: taskId,
        title: '新しいタイトル',
        completed: false,
        description: '牛乳と卵を買う',
        createdAt: '2021-06-22T14:24:02.071Z',
        updatedAt: updatedAt,
      },
      expectedUpdateExpression: 'SET #title = :title, #updatedAt = :updatedAt',
      expectedExpressionAttributeNames: {
        '#title': 'title',
        '#updatedAt': 'updatedAt',
      },
      expectedExpressionAttributeValues: {
        ':title': '新しいタイトル',
        ':updatedAt': expect.any(String),
      },
      expectedTask: {
        id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
        completed: false,
        createdAt: '2021-06-22T14:24:02.071Z',
        description: '牛乳と卵を買う',
        title: '新しいタイトル',
        updatedAt: expect.any(String),
      },
    },
  ];

  test.each(tests)(
    '$name',
    async ({
      input,
      mockedReturnValue,
      expectedUpdateExpression,
      expectedExpressionAttributeNames,
      expectedExpressionAttributeValues,
      expectedTask,
    }) => {
      documentMockClient
        .on(UpdateCommand)
        .resolves({ Attributes: mockedReturnValue });

      const result = await taskRepository.update(taskId, input);

      const callsOfUpdate = documentMockClient.commandCalls(UpdateCommand);
      expect(callsOfUpdate).toHaveLength(1);

      const updateParams = callsOfUpdate[0].args[0].input;
      expect(updateParams.TableName).toBe(TASK_TABLE_NAME);
      expect(updateParams.Key).toEqual({
        userId: userId,
        taskId: taskId,
      });
      expect(updateParams.UpdateExpression).toBe(expectedUpdateExpression);
      expect(updateParams.ExpressionAttributeNames).toEqual(
        expectedExpressionAttributeNames,
      );
      expect(updateParams.ExpressionAttributeValues).toEqual(
        expectedExpressionAttributeValues,
      );
      expect(result).toEqual(expectedTask);
    },
  );
});
