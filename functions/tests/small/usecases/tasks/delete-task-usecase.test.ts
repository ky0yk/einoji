import { AppError } from '../../../../src/utils/errors/app-errors';
import { ErrorCode } from '../../../../src/utils/errors/error-codes';
import { Task } from '../../../../src/domain/task';
import { taskRepository } from '../../../../src/infrastructure/ddb/task-repository';
import { deleteTaskUseCase } from '../../../../src/usecases/tasks/delete-task-usecase';

jest.mock('../../../../src/infrastructure/ddb/task-repository');

describe('deleteTaskUseCase', () => {
  beforeEach(() => {
    (taskRepository.findById as jest.Mock).mockClear();
    (taskRepository.delete as jest.Mock).mockClear();
  });

  const validTaskId = 'valid-task-id';

  test('given a valid taskId, should delete the task', async () => {
    const dummyTask: Task = {
      id: validTaskId,
      title: 'コーヒーを淹れる',
      completed: false,
      description: '濃いめで',
      createdAt: '2021-06-22T14:24:02.071Z',
      updatedAt: '2021-06-22T14:24:02.071Z',
    };

    (taskRepository.findById as jest.Mock).mockResolvedValue(dummyTask);

    await deleteTaskUseCase(validTaskId);

    expect(taskRepository.findById).toHaveBeenCalledTimes(1);
    expect(taskRepository.findById).toHaveBeenCalledWith(validTaskId);
    expect(taskRepository.delete).toHaveBeenCalledTimes(1);
    expect(taskRepository.delete).toHaveBeenCalledWith(validTaskId);
  });

  test('given a non-existent taskId, should throw AppError with TASK_NOT_FOUND', async () => {
    (taskRepository.findById as jest.Mock).mockResolvedValue(null);

    const err = await deleteTaskUseCase(validTaskId).catch((e: Error) => e);

    if (!(err instanceof AppError)) {
      fail('Error should be an instance of AppError');
    }
    expect(err.code).toBe(ErrorCode.TASK_NOT_FOUND);
    expect(taskRepository.findById).toHaveBeenCalledTimes(1);
    expect(taskRepository.findById).toHaveBeenCalledWith(validTaskId);
    expect(taskRepository.delete).not.toHaveBeenCalled();
  });
});
