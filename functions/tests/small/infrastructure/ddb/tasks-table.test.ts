import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { TaskRecord } from '../../../../src/domain/taskRecord';
import {
  DdbError,
  DdbServerError,
} from '../../../../src/infrastructure/ddb/errors/ddb-errors';
import { _testExports } from '../../../../src/infrastructure/ddb/tasks-table';

const { fetchTaskByIdImpl, errorHandler } = _testExports;

const documentMockClient = mockClient(DynamoDBDocumentClient);

const TASK_TABLE_NAME = process.env.TASKS_TABLE_NAME;

describe('fetchTaskByIdImpl', () => {
  const mockTaskId = '1a7244c5-06d3-47e2-560e-f0b5534c8246';
  const dummyTaskRecord: TaskRecord = {
    userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
    taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  beforeEach(() => {
    documentMockClient.reset();
  });

  test('should return a task record for a valid task ID', async () => {
    documentMockClient.on(GetCommand).resolves({ Item: dummyTaskRecord });

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
    documentMockClient.on(GetCommand).resolves({});
    const task = await fetchTaskByIdImpl('some-task-id');

    expect(task).toBeNull();
    expect(documentMockClient.calls()).toHaveLength(1);
  });

  test('should throw an error if the retrieved item does not match the schema', async () => {
    documentMockClient
      .on(GetCommand)
      .resolves({ Item: { invalidField: 'invalidValue' } });
    await expect(fetchTaskByIdImpl(mockTaskId)).rejects.toThrow(DdbServerError);
    expect(documentMockClient.calls()).toHaveLength(1);
  });
});

describe('errorHandler', () => {
  it('should handle different errors', () => {
    expect(() =>
      errorHandler(new DdbServerError('DynamoDB Server error')),
    ).toThrow(DdbServerError);
    expect(() => errorHandler(new DdbError('DynamoDB error'))).toThrow(
      DdbError,
    );
    expect(() => errorHandler(new Error('Unknown error'))).toThrow(DdbError);
  });
});
