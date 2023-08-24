import { fetchTaskById } from '../../../src/infrastructure/ddb/tasks-table';
import { TaskItem } from '../../../src/domain/taskItem';
import { Task } from '../../../src/domain/task';
import { getTaskUseCase } from '../../../src/usecases/get-task-usecase';
import { AppError } from '../../../src/common/errors/app-errors';
import { ErrorCode } from '../../../src/common/errors/error-codes';

jest.mock('../../../src/infrastructure/ddb/tasks-table');

describe('getTask', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should return a task when it exists', async () => {
    const taskId = 'some-task-id';
    const taskRecord: TaskItem = {
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
    (fetchTaskById as jest.Mock).mockResolvedValueOnce(taskRecord);

    const result = await getTaskUseCase(taskId);

    expect(result).toEqual(expectedTask);
  });

  test('should throw TaskNotFoundError when the task is not found', async () => {
    const taskId = 'not-found-id';
    (fetchTaskById as jest.Mock).mockResolvedValueOnce(null);

    await expect(getTaskUseCase(taskId)).rejects.toThrowError(
      new AppError(ErrorCode.TASK_NOT_FOUND),
    );
  });
});
