import { TaskNotFoundError } from '../../domain/errors/task-errors';
import { Task } from '../../domain/task';
import { taskRepository } from '../../infrastructure/ddb/task-repository';
import { useCaseFactory } from '../factory/usecase-factory';

const getTask = async (taskId: string): Promise<Task> => {
  const task = await taskRepository.findById(taskId);
  if (!task) {
    throw new TaskNotFoundError(`The task not found. Task ID: ${taskId}`);
  }

  return task;
};

export const getTaskUseCase = useCaseFactory('getTask', getTask);
