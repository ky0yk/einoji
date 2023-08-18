import { Task, toTask } from '../domain/task';
import {
  fetchTaskById,
  createTask as ddbCreateTask,
} from '../infrastructure/ddb/tasks-table';
import { TaskUnknownError } from '../domain/errors/task-errors';
import { useCaseFactory } from './factory/usecase-factory';
import { CreateTaskRequest } from '../handlers/request_schemas/create-task-request';

const createTask = async (body: CreateTaskRequest): Promise<Task> => {
  const newTaskId = await ddbCreateTask(body);
  const newTaskRecord = await fetchTaskById(newTaskId);
  if (!newTaskRecord) {
    throw new TaskUnknownError(`Task unkwnon error.`);
  }
  return toTask(newTaskRecord);
};

export const createTaskUseCase = useCaseFactory('createTask', createTask);
