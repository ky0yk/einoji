import { _testExports } from '../../../src/usecases/get-task-usecase';
import { fetchTaskById } from '../../../src/infrastructure/ddb/tasks-table';
import { TaskNotFoundError } from '../../../src/usecases/errors/task-errors';
import { TaskRecord } from '../../../src/domain/taskRecord';
import { Task } from '../../../src/domain/task';
import {
  DdbClientError,
  DdbServerError,
} from '../../../src/infrastructure/ddb/errors/ddb-errors';
import { ClientError, ServerError } from '../../../src/common/app-errors';
import { ErrorCode } from '../../../src/common/error-codes';

const { getTask, errorHandler } = _testExports;

jest.mock('../../../src/infrastructure/ddb/tasks-table');

describe('getTask', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return a task when it exists', async () => {
    const taskId = 'some-task-id';
    const taskRecord: TaskRecord = {
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

    const result = await getTask(taskId);

    expect(result).toEqual(expectedTask);
  });

  it('should throw TaskNotFoundError when the task is not found', async () => {
    const taskId = 'not-found-id';
    (fetchTaskById as jest.Mock).mockResolvedValueOnce(null);

    await expect(getTask(taskId)).rejects.toThrowError(
      new TaskNotFoundError(`Task with taskId ${taskId} not found.`),
    );
  });
});

describe('errorHandler', () => {
  it('should return ClientError for TaskNotFoundError', () => {
    const error = new TaskNotFoundError('Task not found.');

    const result = errorHandler(error);

    expect(result).toBeInstanceOf(ClientError);
    expect(result.code).toEqual(ErrorCode.TASK_NOT_FOUND);
  });

  it('should return ClientError for DdbClientError', () => {
    const error = new DdbClientError('DDB client error.');

    const result = errorHandler(error);

    expect(result).toBeInstanceOf(ClientError);
    expect(result.code).toEqual(ErrorCode.DDB_CLIENT_ERROR);
  });

  it('should return ServerError for DdbServerError', () => {
    const error = new DdbServerError('DDB server error.');

    const result = errorHandler(error);

    expect(result).toBeInstanceOf(ServerError);
    expect(result.code).toEqual(ErrorCode.DDB_SERVER_ERROR);
  });

  it('should return ServerError for other errors', () => {
    const error = new Error('Unknown error.');

    const result = errorHandler(error);

    expect(result).toBeInstanceOf(ServerError);
    expect(result.code).toEqual(ErrorCode.INTERNAL_SERVER_ERROR);
  });
});
