import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { DdbInternalServerError } from '../../../../src/infrastructure/ddb/errors/ddb-errors';
import { getTaskItemById } from '../../../../src/infrastructure/ddb/tasks-table';
import { TaskItem } from '../../../../src/domain/taskItem';

const documentMockClient = mockClient(DynamoDBDocumentClient);

const TASK_TABLE_NAME = process.env.TASKS_TABLE_NAME;

describe('fetchTaskById', () => {
  const mockTaskId = '1a7244c5-06d3-47e2-560e-f0b5534c8246';

  beforeEach(() => {
    documentMockClient.reset();
  });

  test('should return a task record for a valid task ID', async () => {
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

    const result = await getTaskItemById(mockTaskId);

    const callsOfGet = documentMockClient.commandCalls(GetCommand);
    expect(callsOfGet).toHaveLength(1);
    expect(callsOfGet[0].args[0].input).toEqual({
      TableName: TASK_TABLE_NAME,
      Key: {
        userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
        taskId: mockTaskId,
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
    const invalidTaskRecord = {
      invalidField: 'invalidValue',
    };

    documentMockClient.on(GetCommand).resolves({ Item: invalidTaskRecord });
    await expect(getTaskItemById(mockTaskId)).rejects.toThrow(
      DdbInternalServerError,
    );
    expect(documentMockClient.calls()).toHaveLength(1);
  });
});
