import { ClientError, ServerError } from '../../../src/common/app-errors';
import { ErrorCode } from '../../../src/common/error-codes';
import { Task } from '../../../src/domain/task';
import { TaskRecord } from '../../../src/domain/taskRecord';
import { DdbServerError } from '../../../src/infrastructure/ddb/errors/ddb-errors';
import { fetchTaskById } from '../../../src/infrastructure/ddb/tasks-table';
import { TaskNotFoundError } from '../../../src/usecases/errors/task-errors';
import { getTaskUseCase } from '../../../src/usecases/get-task-usecase';

jest.mock('../../../src/infrastructure/ddb/tasks-table');

describe('getTaskUseCase', () => {
  const dummyTaskRecord: TaskRecord = {
    userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
    taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };
  const expectedTask: Task = {
    id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  test('should return the expected task for a valid taskId', async () => {
    const taskId = 'valid-task-id';
    (fetchTaskById as jest.Mock).mockResolvedValueOnce(dummyTaskRecord);
    const result = await getTaskUseCase(taskId);
    expect(result).toEqual(expectedTask);
  });

  test('should throw a ClientError with TASK_NOT_FOUND code for an invalid taskId', async () => {
    const taskId = 'invalid-task-id';
    (fetchTaskById as jest.Mock).mockResolvedValueOnce(null);
    await expect(getTaskUseCase(taskId)).rejects.toThrow(
      new ClientError(ErrorCode.TASK_NOT_FOUND),
    );
  });

  test('should handle a DdbServerError and return a ServerError with DDB_SERVER_ERROR code', async () => {
    const taskId = 'valid-task-id';
    (fetchTaskById as jest.Mock).mockRejectedValueOnce(
      new DdbServerError('DynamoDB error'),
    );

    await expect(getTaskUseCase(taskId)).rejects.toEqual(
      new ServerError(ErrorCode.DDB_SERVER_ERROR),
    );
  });
});
