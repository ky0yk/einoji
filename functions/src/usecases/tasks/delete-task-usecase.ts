import { TaskNotFoundError } from '../../domain/task/errors/task-errors';
import { taskRepository } from '../../infrastructure/ddb/task-repository';
import { useCaseFactory } from '../factory/usecase-factory';

const deleteTask = async (taskId: string): Promise<void> => {
  const task = await taskRepository.findById(taskId);
  if (!task) {
    throw new TaskNotFoundError(`The task not found. Task ID: ${taskId}`);
  }

  await taskRepository.delete(taskId);
};

export const deleteTaskUseCase = useCaseFactory('deleteTask', deleteTask);
