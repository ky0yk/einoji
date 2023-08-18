import { CreateTaskRequest, Task, toTask } from '../../../src/domain/task';
import { TaskRecord } from '../../../src/domain/taskRecord';
import {
  createTask as ddbCreateTask,
  fetchTaskById,
} from '../../../src/infrastructure/ddb/tasks-table';
import {
  TaskConversionError,
  TaskUnknownError,
} from '../../../src/domain/errors/task-errors';
import { createTaskUseCase } from '../../../src/usecases/create-task-usecase';
import {
  DdbClientError,
  DdbServerError,
  DdbUnknownError,
} from '../../../src/infrastructure/ddb/errors/ddb-errors';
import { ErrorCode } from '../../../src/common/error-codes';
import { ClientError, ServerError } from '../../../src/common/app-errors';

jest.mock('../../../src/infrastructure/ddb/tasks-table');
jest.mock('../../../src/domain/task');

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

const dummyTaskRecord: TaskRecord = {
  userId: '1a7244c5-06d3-47e2-560e-f0b5534c8246',
  taskId: 'f0f8f5a0-309d-11ec-8d3d-0242ac130003',
  title: 'スーパーに買い物に行く',
  completed: false,
  description: '牛乳と卵を買う',
  createdAt: '2021-06-22T14:24:02.071Z',
  updatedAt: '2021-06-22T14:24:02.071Z',
};

describe('createTaskUseCase', () => {
  beforeEach(() => {
    (ddbCreateTask as jest.Mock).mockClear();
    (fetchTaskById as jest.Mock).mockClear();
    (toTask as jest.Mock).mockClear();
  });

  test.each`
    request                                     | task
    ${dummyCreateTaskRequest}                   | ${dummyTask}
    ${dummyCreateTaskRequestWithoutDescription} | ${dummyTaskWithoutDescription}
  `('should create a task successfully', async ({ request, task }) => {
    (ddbCreateTask as jest.Mock).mockResolvedValue(validTaskId);
    (fetchTaskById as jest.Mock).mockResolvedValue(dummyTaskRecord);
    (toTask as jest.Mock).mockReturnValue(task);

    const result = await createTaskUseCase(request);

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

    await expect(createTaskUseCase(dummyCreateTaskRequest)).rejects.toThrow(
      ServerError,
    );

    expect(ddbCreateTask).toHaveBeenCalledTimes(1);
    expect(ddbCreateTask).toHaveBeenCalledWith(dummyCreateTaskRequest);

    expect(fetchTaskById).toHaveBeenCalledTimes(1);
    expect(fetchTaskById).toHaveBeenCalledWith(invalidTaskId);
  });
});

describe('should throw Error when', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test.each`
    occurError                 | expectedError
    ${new DdbClientError('')}  | ${new ClientError(ErrorCode.DDB_CLIENT_ERROR)}
    ${new DdbServerError('')}  | ${new ServerError(ErrorCode.DDB_SERVER_ERROR)}
    ${new DdbUnknownError('')} | ${new ServerError(ErrorCode.DDB_UNKNOWN_ERROR)}
  `(
    'ddbCreateTask encounters an error',
    async ({ occurError, expectedError }) => {
      (ddbCreateTask as jest.Mock).mockRejectedValue(occurError);

      await expect(createTaskUseCase(dummyCreateTaskRequest)).rejects.toThrow(
        expectedError,
      );
    },
  );

  test.each`
    occurError                 | expectedError
    ${new DdbClientError('')}  | ${new ClientError(ErrorCode.DDB_CLIENT_ERROR)}
    ${new DdbServerError('')}  | ${new ServerError(ErrorCode.DDB_SERVER_ERROR)}
    ${new DdbUnknownError('')} | ${new ServerError(ErrorCode.DDB_UNKNOWN_ERROR)}
  `(
    'fetchTaskById encounters an error',
    async ({ occurError, expectedError }) => {
      (fetchTaskById as jest.Mock).mockRejectedValue(occurError);

      await expect(createTaskUseCase(dummyCreateTaskRequest)).rejects.toThrow(
        expectedError,
      );
    },
  );

  test.each`
    occurError                     | expectedError
    ${new TaskConversionError('')} | ${new ClientError(ErrorCode.TASK_CONVERSION_ERROR)}
    ${new TaskUnknownError('')}    | ${new ClientError(ErrorCode.TASK_UNKNOWN_ERROR)}
  `(
    'toTask conversion encounters an error',
    async ({ occurError, expectedError }) => {
      (fetchTaskById as jest.Mock).mockRejectedValue(occurError);

      await expect(createTaskUseCase(dummyCreateTaskRequest)).rejects.toThrow(
        expectedError,
      );
    },
  );
});
