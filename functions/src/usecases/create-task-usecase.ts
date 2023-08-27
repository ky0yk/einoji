import { Task, toTask } from '../domain/task';
import { TaskNotFoundError } from '../domain/errors/task-errors';
import { useCaseFactory } from './factory/usecase-factory';
import { CreateTaskRequest } from '../handlers/http/requestSchemas/create-task-request';
import {
  createTaskItem,
  getTaskItemById,
} from '../infrastructure/ddb/tasks-table';

const createTask = async (body: CreateTaskRequest): Promise<Task> => {
  const newTaskId = await createTaskItem(body);
  const newTaskRecord = await getTaskItemById(newTaskId);
  if (!newTaskRecord) {
    throw new TaskNotFoundError('Task not found after creation.');
  }
  return toTask(newTaskRecord);
};

export const createTaskUseCase = useCaseFactory('createTask', createTask);
