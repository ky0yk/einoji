import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { TaskRecord } from '../../../../src/domain/taskRecord';
import { DdbServerError } from '../../../../src/infrastructure/ddb/errors/ddb-errors';
import { _testExports } from '../../../../src/infrastructure/ddb/tasks-table';
import { z } from 'zod';
import {
  mockGetCommandOutput,
  mockPutCommandOutput,
} from '../../../medium/infrastructure/ddb/tasks-table-helper';

const { createTaskImpl, fetchTaskByIdImpl } = _testExports;

const documentMockClient = mockClient(DynamoDBDocumentClient);

const TASK_TABLE_NAME = process.env.TASKS_TABLE_NAME;

describe('createTaskImpl', () => {
  afterEach(() => {
    documentMockClient.reset();
  });
  const UuidSchema = z.string().uuid();

  test('should return a generated UUID', async () => {
    const taskBody = { title: 'Test Task', description: 'Test Description' };
    const mockResponse = mockPutCommandOutput(200);
    documentMockClient.on(PutCommand).resolves(mockResponse);

    const createdTaskId = await createTaskImpl(taskBody);

    // mockが一回呼ばれたことを確認
    const callsOfPut = documentMockClient.commandCalls(PutCommand);
    expect(callsOfPut).toHaveLength(1);
    // PutCommandの引数を確認
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
    // 戻り値がUUIDであることを確認
    const parseResult = UuidSchema.safeParse(createdTaskId);
    expect(parseResult.success).toBe(true);
  });

  test('should handle empty description gracefully', async () => {
    const taskBody = { title: 'Test Task' };
    const mockResponse = mockPutCommandOutput(200);
    documentMockClient.on(PutCommand).resolves(mockResponse);

    const createdTaskId = await createTaskImpl(taskBody);

    // mockが一回呼ばれたことを確認
    const callsOfPut = documentMockClient.commandCalls(PutCommand);
    expect(callsOfPut).toHaveLength(1);
    // PutCommandの引数を確認
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
    // 戻り値がUUIDであることを確認
    const parseResult = UuidSchema.safeParse(createdTaskId);
    expect(parseResult.success).toBe(true);
  });
});

describe('fetchTaskByIdImpl', () => {
  const mockTaskId = '1a7244c5-06d3-47e2-560e-f0b5534c8246';

  beforeEach(() => {
    documentMockClient.reset();
  });

  test('should return a task record for a valid task ID', async () => {
    const dummyTaskRecord: TaskRecord = {
      userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
      taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
      title: 'スーパーに買い物に行く',
      completed: false,
      description: '牛乳と卵を買う',
      createdAt: '2021-06-22T14:24:02.071Z',
      updatedAt: '2021-06-22T14:24:02.071Z',
    };
    const mockResponse = mockGetCommandOutput(200, dummyTaskRecord);
    documentMockClient.on(GetCommand).resolves(mockResponse);

    const result = await fetchTaskByIdImpl(mockTaskId);

    const callsOfGet = documentMockClient.commandCalls(GetCommand);
    expect(callsOfGet).toHaveLength(1);
    expect(callsOfGet[0].args[0].input).toEqual({
      TableName: TASK_TABLE_NAME,
      Key: {
        userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
        taskId: mockTaskId,
      },
    });
    expect(result).toEqual(dummyTaskRecord);
  });

  test('should return null if the task is not found', async () => {
    const mockResponse = mockGetCommandOutput(200, undefined);
    documentMockClient.on(GetCommand).resolves(mockResponse);
    const task = await fetchTaskByIdImpl('some-task-id');

    expect(task).toBeNull();
    expect(documentMockClient.calls()).toHaveLength(1);
  });

  test('should throw an error if the retrieved item does not match the schema', async () => {
    const invalidTaskRecord = {
      invalidField: 'invalidValue',
    };
    const mockResponse = mockGetCommandOutput(200, invalidTaskRecord);
    documentMockClient.on(GetCommand).resolves(mockResponse);
    await expect(fetchTaskByIdImpl(mockTaskId)).rejects.toThrow(DdbServerError);
    expect(documentMockClient.calls()).toHaveLength(1);
  });
});
