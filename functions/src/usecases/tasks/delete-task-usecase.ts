import { TaskNotFoundError } from '../../domain/task/errors/task-errors';
import { taskRepository } from '../../infrastructure/ddb/task-repository';
import { taskUsecaseFactory } from './factory/task-usecase-factory';

const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  const task = await taskRepository.findById(userId, taskId);
  if (!task) {
    throw new TaskNotFoundError(`The task not found. Task ID: ${taskId}`);
  }

  await taskRepository.delete(userId, taskId);
};

export const deleteTaskUseCase = taskUsecaseFactory('deleteTask', deleteTask);
