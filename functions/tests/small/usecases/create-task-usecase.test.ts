import { Task } from '../../../src/domain/task';
import { createTaskUseCase } from '../../../src/usecases/create-task-usecase';
import { ErrorCode } from '../../../src/common/errors/error-codes';
import { taskRepository } from '../../../src/infrastructure/ddb/task-repository';
import { AppError } from '../../../src/common/errors/app-errors';
import { CreateTaskRequest } from '../../../src/handlers/schemas/task-requests';

jest.mock('../../../src/infrastructure/ddb/task-repository');

describe('createTaskUseCase', () => {
  beforeEach(() => {
    (taskRepository.create as jest.Mock).mockClear();
    (taskRepository.getById as jest.Mock).mockClear();
  });

  const dummyCreateTaskRequest: CreateTaskRequest = {
    title: 'コーヒーを淹れる',
    description: '濃いめで',
  };
  const dummyCreateTaskRequestWithoutDescription: CreateTaskRequest = {
    title: 'コーヒーを淹れる',
  };

  const dummyTask: Task = {
    id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };
  const dummyTaskWithoutDescription: Task = {
    id: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  const validTaskId = 'valid-task-id';

  test.each`
    request                                     | task
    ${dummyCreateTaskRequest}                   | ${dummyTask}
    ${dummyCreateTaskRequestWithoutDescription} | ${dummyTaskWithoutDescription}
  `('should create a task successfully', async ({ request, task }) => {
    (taskRepository.create as jest.Mock).mockResolvedValue(validTaskId);
    (taskRepository.getById as jest.Mock).mockResolvedValue(task);

    const result = await createTaskUseCase(request);

    expect(taskRepository.create).toHaveBeenCalledTimes(1);
    expect(taskRepository.create).toHaveBeenCalledWith(request);

    expect(taskRepository.getById).toHaveBeenCalledTimes(1);
    expect(taskRepository.getById).toHaveBeenCalledWith(validTaskId);

    expect(result).toEqual(task);
  });

  test('should throw AppError with TASK_NOT_FOUND if TaskItem is not found', async () => {
    const invalidTaskId = 'invalid-task-id';

    (taskRepository.create as jest.Mock).mockResolvedValue(invalidTaskId);
    (taskRepository.getById as jest.Mock).mockResolvedValue(null);

    const err = await createTaskUseCase(dummyCreateTaskRequest).catch((e) => e);
    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe(ErrorCode.TASK_NOT_FOUND);

    expect(taskRepository.create).toHaveBeenCalledTimes(1);
    expect(taskRepository.create).toHaveBeenCalledWith(dummyCreateTaskRequest);

    expect(taskRepository.getById).toHaveBeenCalledTimes(1);
    expect(taskRepository.getById).toHaveBeenCalledWith(invalidTaskId);
  });
});
