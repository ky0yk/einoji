import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { DdbInternalServerError } from '../../../../src/infrastructure/ddb/errors/ddb-errors';
import {
  createTaskItem,
  getTaskItemById,
<<<<<<< Updated upstream:functions/tests/small/infrastructure/ddb/task-repository.test.ts
} from '../../../../src/infrastructure/ddb/task-repository';
import { TaskItem } from '../../../../src/domain/taskItem';
=======
} from '../../../../src/infrastructure/ddb/tasks-repository';
import { TaskItem } from '../../../../src/infrastructure/ddb/schemas/task-item';
>>>>>>> Stashed changes:functions/tests/small/infrastructure/ddb/tasks-table.test.ts
import { z } from 'zod';

const documentMockClient = mockClient(DynamoDBDocumentClient);
const TASK_TABLE_NAME = process.env.TASKS_TABLE_NAME;

describe('createTaskItem', () => {
  afterEach(() => {
    documentMockClient.reset();
  });
  const UuidSchema = z.string().uuid();

  test('should return a generated UUID when creating a task with a title and description', async () => {
    const taskBody = { title: 'Test Task', description: 'Test Description' };
    documentMockClient.on(PutCommand).resolves({});

    const createdTaskId = await createTaskItem(taskBody);

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

    const createdTaskId = await createTaskItem(taskBody);

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

describe('getTaskItemById', () => {
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

    documentMockClient.on(GetCommand).resolves({ Item: dummyTaskItem });

    const result = await getTaskItemById(dummyTaskId);

    const callsOfGet = documentMockClient.commandCalls(GetCommand);
    expect(callsOfGet).toHaveLength(1);
    expect(callsOfGet[0].args[0].input).toEqual({
      TableName: TASK_TABLE_NAME,
      Key: {
        userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
        taskId: dummyTaskId,
      },
    });
    expect(result).toEqual(dummyTaskItem);
  });

  test('should return null if the task is not found', async () => {
    documentMockClient.on(GetCommand).resolves({});
    const task = await getTaskItemById('some-task-id');

    expect(task).toBeNull();
    expect(documentMockClient.calls()).toHaveLength(1);
  });

  test('should throw an error if the retrieved item does not match the schema', async () => {
    const invalidTaskItem = {
      invalidField: 'invalidValue',
    };

    documentMockClient.on(GetCommand).resolves({ Item: invalidTaskItem });
    await expect(getTaskItemById(dummyTaskId)).rejects.toThrow(
      DdbInternalServerError,
    );
    expect(documentMockClient.calls()).toHaveLength(1);
  });
});
