import { Task, toTask } from '../../../src/domain/task';
import { TaskItem } from '../../../src/domain/taskItem';
import { createTaskUseCase } from '../../../src/usecases/create-task-usecase';
import { CreateTaskRequest } from '../../../src/handlers/http/requestSchemas/create-task-request';
import { ErrorCode } from '../../../src/common/errors/error-codes';
import {
  createTaskItem,
  getTaskItemById,
} from '../../../src/infrastructure/ddb/tasks-table';
import { AppError } from '../../../src/common/errors/app-errors';

jest.mock('../../../src/infrastructure/ddb/tasks-table');
jest.mock('../../../src/domain/task');

describe('createTaskUseCase', () => {
  beforeEach(() => {
    (createTaskItem as jest.Mock).mockClear();
    (getTaskItemById as jest.Mock).mockClear();
    (toTask as jest.Mock).mockClear();
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

  const dummyTaskItem: TaskItem = {
    userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
    taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
    title: 'スーパーに買い物に行く',
    completed: false,
    description: '牛乳と卵を買う',
    createdAt: '2021-06-22T14:24:02.071Z',
    updatedAt: '2021-06-22T14:24:02.071Z',
  };

  test.each`
    request                                     | task
    ${dummyCreateTaskRequest}                   | ${dummyTask}
    ${dummyCreateTaskRequestWithoutDescription} | ${dummyTaskWithoutDescription}
  `('should create a task successfully', async ({ request, task }) => {
    (createTaskItem as jest.Mock).mockResolvedValue(validTaskId);
    (getTaskItemById as jest.Mock).mockResolvedValue(dummyTaskItem);
    (toTask as jest.Mock).mockReturnValue(task);

    const result = await createTaskUseCase(request);

    expect(createTaskItem).toHaveBeenCalledTimes(1);
    expect(createTaskItem).toHaveBeenCalledWith(request);

    expect(getTaskItemById).toHaveBeenCalledTimes(1);
    expect(getTaskItemById).toHaveBeenCalledWith(validTaskId);

    expect(toTask).toHaveBeenCalledTimes(1);
    expect(toTask).toHaveBeenCalledWith(dummyTaskItem);

    expect(result).toEqual(task);
  });

  test('should throw AppError with TASK_NOT_FOUND if TaskItem is not found', async () => {
    const invalidTaskId = 'invalid-task-id';

    (createTaskItem as jest.Mock).mockResolvedValue(invalidTaskId);
    (getTaskItemById as jest.Mock).mockResolvedValue(null);

    const err = await createTaskUseCase(dummyCreateTaskRequest).catch((e) => e);
    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe(ErrorCode.TASK_NOT_FOUND);

    expect(createTaskItem).toHaveBeenCalledTimes(1);
    expect(createTaskItem).toHaveBeenCalledWith(dummyCreateTaskRequest);

    expect(getTaskItemById).toHaveBeenCalledTimes(1);
    expect(getTaskItemById).toHaveBeenCalledWith(invalidTaskId);
  });
});
