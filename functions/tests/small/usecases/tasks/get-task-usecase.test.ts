import { AppError } from '../../../../src/utils/errors/app-errors';
import { ErrorCode } from '../../../../src/utils/errors/error-codes';
import { Task } from '../../../../src/domain/task';
import { taskRepository } from '../../../../src/infrastructure/ddb/task-repository';
import { getTaskUseCase } from '../../../../src/usecases/tasks/get-task-usecase';

jest.mock('../../../../src/infrastructure/ddb/task-repository');

describe('getTask', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should return a task when it exists', async () => {
    const taskId = 'some-task-id';
    const dummyTask: Task = {
      id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
      title: 'スーパーに買い物に行く',
      completed: false,
      description: '牛乳と卵を買う',
      createdAt: '2021-06-22T14:24:02.071Z',
      updatedAt: '2021-06-22T14:24:02.071Z',
    };
    (taskRepository.findById as jest.Mock).mockResolvedValueOnce(dummyTask);

    const result = await getTaskUseCase(taskId);

    expect(result).toEqual(dummyTask);
    expect(taskRepository.findById).toHaveBeenCalledTimes(1);
    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
  });

  test('should throw AppError with TASK_NOT_FOUND when the task is not found', async () => {
    const taskId = 'not-found-id';
    (taskRepository.findById as jest.Mock).mockResolvedValueOnce(null);

    const err = await getTaskUseCase(taskId).catch((e: AppError) => e);
    if (!(err instanceof AppError)) {
      fail('Error should be an instance of AppError');
    }

    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe(ErrorCode.TASK_NOT_FOUND);

    expect(taskRepository.findById).toHaveBeenCalledTimes(1);
    expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
  });
});
