import { TaskItem } from '../../../src/domain/taskItem';
import { Task } from '../../../src/domain/task';
import { getTaskUseCase } from '../../../src/usecases/get-task-usecase';
import { AppError } from '../../../src/common/errors/app-errors';
import { ErrorCode } from '../../../src/common/errors/error-codes';
import { getTaskItemById } from '../../../src/infrastructure/ddb/tasks-table';

jest.mock('../../../src/infrastructure/ddb/tasks-table');

describe('getTask', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should return a task when it exists', async () => {
    const taskId = 'some-task-id';
    const dummyTaskItem: TaskItem = {
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
    (getTaskItemById as jest.Mock).mockResolvedValueOnce(dummyTaskItem);

    const result = await getTaskUseCase(taskId);

    expect(result).toEqual(expectedTask);
    expect(getTaskItemById).toHaveBeenCalledTimes(1);
    expect(getTaskItemById).toHaveBeenCalledWith(taskId);
  });

  test('should throw AppError with TASK_NOT_FOUND when the task is not found', async () => {
    const taskId = 'not-found-id';
    (getTaskItemById as jest.Mock).mockResolvedValueOnce(null);

    const err = await getTaskUseCase(taskId).catch((e) => e);
    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe(ErrorCode.TASK_NOT_FOUND);
    expect(getTaskItemById).toHaveBeenCalledTimes(1);
    expect(getTaskItemById).toHaveBeenCalledWith(taskId);
  });

  test('should throw AppError with MALFORMED_DATA when the TaskItem cannot be converted to Task', async () => {
    const taskId = 'some-task-id';
    const invalidTaskItem = {
      invalidField: 'invalidValue',
    };
    (getTaskItemById as jest.Mock).mockResolvedValueOnce(invalidTaskItem);

    const err = await getTaskUseCase(taskId).catch((e) => e);
    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe(ErrorCode.MALFORMED_DATA);
    expect(getTaskItemById).toHaveBeenCalledTimes(1);
    expect(getTaskItemById).toHaveBeenCalledWith(taskId);
  });
});
