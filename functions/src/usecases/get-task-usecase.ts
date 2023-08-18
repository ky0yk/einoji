import { Task, toTask } from '../domain/task';
import { fetchTaskById } from '../infrastructure/ddb/tasks-table';
import { TaskNotFoundError } from '../domain/errors/task-errors';
import { useCaseFactory } from './factory/usecase-factory';

const getTask = async (taskId: string): Promise<Task> => {
  const taskRecord = await fetchTaskById(taskId);
  if (!taskRecord) {
    throw new TaskNotFoundError(`Task with taskId ${taskId} not found.`);
  }

  return toTask(taskRecord);
};

export const getTaskUseCase = useCaseFactory('getTask', getTask);
