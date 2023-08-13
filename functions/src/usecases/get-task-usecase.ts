import { Task } from '../domain/task';
import { TaskRecord } from '../domain/taskRecord';
import { fetchTaskById } from '../infrastructure/ddb/tasks';
import { TaskNotFoundError } from './errors/task-errors';
import { useCaseFactory } from './utils/usecase-factory';
import {
  DdbClientError,
  DdbServerError,
} from '../infrastructure/ddb/errors/ddb-errors';
import { ClientError, ServerError } from '../common/app-errors';
import { ErrorCode } from '../common/error-codes';

const getTask = async (taskId: string): Promise<Task> => {
  const taskRecord = await fetchTaskById(taskId);
  if (!taskRecord) {
    throw new TaskNotFoundError(`Task with taskId ${taskId} not found.`);
  }

  return toTask(taskRecord);
};

const toTask = (taskRecord: TaskRecord): Task => {
  return {
    id: taskRecord.taskId,
    title: taskRecord.title,
    description: taskRecord.description,
    completed: taskRecord.completed,
    createdAt: taskRecord.createdAt,
    updatedAt: taskRecord.updatedAt,
  };
};

const errorHandler = (error: Error) => {
  if (error instanceof TaskNotFoundError) {
    return new ClientError(ErrorCode.TASK_NOT_FOUND, error);
  }
  if (error instanceof DdbClientError) {
    return new ClientError(ErrorCode.DDB_CLIENT_ERROR, error);
  }
  if (error instanceof DdbServerError) {
    return new ServerError(ErrorCode.DDB_SERVER_ERROR, error);
  }
  return new ServerError(ErrorCode.INTERNAL_SERVER_ERROR, error);
};

export const getTaskUseCase = useCaseFactory(getTask, errorHandler);

export const _testExports = {
  getTask,
  errorHandler,
};
