import { CreateTaskRequest, Task, toTask } from '../domain/task';
import {
  fetchTaskById,
  createTask as ddbCreateTask,
} from '../infrastructure/ddb/tasks-table';
import { TaskUnknownError } from '../domain/errors/task-errors';
import { useCaseFactory } from './utils/usecase-factory';

const createTask = async (body: CreateTaskRequest): Promise<Task> => {
  const newTaskId = await ddbCreateTask(body);
  const newTaskRecord = await fetchTaskById(newTaskId);
  if (!newTaskRecord) {
    throw new TaskUnknownError(`Task unkwnon error.`);
  }
  return toTask(newTaskRecord);
};

export const createTaskUseCase = useCaseFactory('createTask', createTask);

export const _testExports = {
  createTask,
};
