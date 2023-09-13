import { Task, toTask } from '../domain/task';
import { getTaskItemById } from '../infrastructure/ddb/task-repository';
import { TaskNotFoundError } from '../domain/errors/task-errors';
import { useCaseFactory } from './factory/usecase-factory';

const getTask = async (taskId: string): Promise<Task> => {
  const taskRecord = await getTaskItemById(taskId);
  if (!taskRecord) {
    throw new TaskNotFoundError(`The task not found. Task ID: ${taskId}`);
  }

  return toTask(taskRecord);
};

export const getTaskUseCase = useCaseFactory('getTask', getTask);
