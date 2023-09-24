import { TaskNotFoundError } from '../../domain/task/errors/task-errors';
import { Task } from '../../domain/task/task';
import { taskRepository } from '../../infrastructure/ddb/task-repository';
import { taskUseCaseFactory } from './factory/task-usecase-factory';

const getTask = async (taskId: string): Promise<Task> => {
  const task = await taskRepository.findById(taskId);
  if (!task) {
    throw new TaskNotFoundError(`The task not found. Task ID: ${taskId}`);
  }

  return task;
};

export const getTaskUseCase = taskUseCaseFactory('getTask', getTask);
