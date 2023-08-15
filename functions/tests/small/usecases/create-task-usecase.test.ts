import { CreateTaskRequest, Task, toTask } from '../../../src/domain/task';
import { TaskRecord } from '../../../src/domain/taskRecord';
import {
  createTask as ddbCreateTask,
  fetchTaskById,
} from '../../../src/infrastructure/ddb/tasks-table';
import { TaskUnknownError } from '../../../src/domain/errors/task-errors';
import { _testExports } from '../../../src/usecases/create-task-usecase';

jest.mock('../../../src/infrastructure/ddb/tasks-table');
jest.mock('../../../src/domain/task');

const { createTask } = _testExports;

describe('createTask', () => {
  beforeEach(() => {
    (ddbCreateTask as jest.Mock).mockClear();
    (fetchTaskById as jest.Mock).mockClear();
    (toTask as jest.Mock).mockClear();
  });
  const dummyCreateTaskRequest: CreateTaskRequest = {
    title: 'mockTitle',
    description: 'mockDescription',
  };
  const dummyCreateTaskRequestWithoutDescription: CreateTaskRequest = {
    title: 'mockTitle',
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

  const dummyTaskRecord: TaskRecord = {
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
    (ddbCreateTask as jest.Mock).mockResolvedValue(validTaskId);
    (fetchTaskById as jest.Mock).mockResolvedValue(dummyTaskRecord);
    (toTask as jest.Mock).mockReturnValue(task);

    const result = await createTask(request);

    expect(ddbCreateTask).toHaveBeenCalledTimes(1);
    expect(ddbCreateTask).toHaveBeenCalledWith(request);

    expect(fetchTaskById).toHaveBeenCalledTimes(1);
    expect(fetchTaskById).toHaveBeenCalledWith(validTaskId);

    expect(toTask).toHaveBeenCalledTimes(1);
    expect(toTask).toHaveBeenCalledWith(dummyTaskRecord);

    expect(result).toEqual(task);
  });

  test('should throw TaskUnknownError if task record is not found', async () => {
    const invalidTaskId = 'invalid-task-id';

    (ddbCreateTask as jest.Mock).mockResolvedValue(invalidTaskId);
    (fetchTaskById as jest.Mock).mockResolvedValue(null);

    await expect(createTask(dummyCreateTaskRequest)).rejects.toThrow(
      TaskUnknownError,
    );

    expect(ddbCreateTask).toHaveBeenCalledTimes(1);
    expect(ddbCreateTask).toHaveBeenCalledWith(dummyCreateTaskRequest);

    expect(fetchTaskById).toHaveBeenCalledTimes(1);
    expect(fetchTaskById).toHaveBeenCalledWith(invalidTaskId);
  });
});
