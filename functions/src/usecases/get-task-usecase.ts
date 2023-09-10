import { Task } from '../domain/task';
import { getTaskItemById } from '../infrastructure/ddb/tasks-table';
import { TaskNotFoundError } from '../domain/errors/task-errors';
import { useCaseFactory } from './factory/usecase-factory';
import { toTask } from '../infrastructure/ddb/schemas/taskItem';

const getTask = async (taskId: string): Promise<Task> => {
  const taskRecord = await getTaskItemById(taskId);
  if (!taskRecord) {
    throw new TaskNotFoundError(`The task not found. Task ID: ${taskId}`);
  }

  return toTask(taskRecord);
};

export const getTaskUseCase = useCaseFactory('getTask', getTask);
