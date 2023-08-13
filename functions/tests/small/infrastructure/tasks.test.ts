import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { fetchTaskById } from '../../../src/infrastructure/ddb/tasks';
import { DdbServerError } from '../../../src/infrastructure/ddb/errors/ddb-errors';
import { mockClient } from 'aws-sdk-client-mock';
import { TaskRecord } from '../../../src/domain/taskRecord';

const documentMockClient = mockClient(DynamoDBDocumentClient);

describe('fetchTaskById', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should return a task if found', async () => {
    const taskId = 'f0f8f5a0-309d-11ec-8d3d-0242ac130003';
    const dummyTaskRecord: TaskRecord = {
      userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
      taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
      title: 'スーパーに買い物に行く',
      completed: false,
      description: '牛乳と卵を買う',
      createdAt: '2021-06-22T14:24:02.071Z',
      updatedAt: '2021-06-22T14:24:02.071Z',
    };
    documentMockClient.on(GetCommand).resolves({ Item: dummyTaskRecord });

    const task = await fetchTaskById(taskId);

    expect(task).toEqual(dummyTaskRecord);
  });

  test('should return null if the task is not found', async () => {
    const taskId = 'some-task-id';

    documentMockClient.on(GetCommand).resolves({});

    const task = await fetchTaskById(taskId);

    expect(task).toBeNull();
  });

  test("should throw an error if there's an issue with parsing", async () => {
    const taskId = 'some-task-id';

    documentMockClient.on(GetCommand).resolves({
      Item: {
        data: 'invalid data',
      },
    });

    await expect(fetchTaskById(taskId)).rejects.toThrow(DdbServerError);
  });
});
