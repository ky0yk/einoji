import { CreateTaskRequest, Task, toTask } from '../../../src/domain/task';
import { createTaskUseCase } from '../../../src/usecases/create-task-usecase';
jest.mock('../../../src/infrastructure/ddb/tasks-table');
import {
  createTask as ddbCreateTask,
  fetchTaskById,
} from '../../../src/infrastructure/ddb/tasks-table';
import {
  DdbClientError,
  DdbServerError,
  DdbUnknownError,
} from '../../../src/infrastructure/ddb/errors/ddb-errors';
import {
  TaskConversionError,
  TaskUnknownError,
} from '../../../src/domain/errors/task-errors';
import { ClientError, ServerError } from '../../../src/common/app-errors';
import { ErrorCode } from '../../../src/common/error-codes';

const taskBody: CreateTaskRequest = {
  title: 'コーヒーを淹れる',
  description: '濃いめで',
};

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

      await expect(createTaskUseCase(taskBody)).rejects.toThrow(expectedError);
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

      await expect(createTaskUseCase(taskBody)).rejects.toThrow(expectedError);
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

      await expect(createTaskUseCase(taskBody)).rejects.toThrow(expectedError);
    },
  );
});
