import { CreateTaskData, Task } from '../../domain/task/task';
import { TaskNotFoundError } from '../../domain/task/errors/task-errors';
import { taskUsecaseFactory } from './factory/task-usecase-factory';
import { taskRepository } from '../../infrastructure/ddb/task-repository';

const createTask = async (
  userId: string,
  data: CreateTaskData,
): Promise<Task> => {
  const newTaskId = await taskRepository.create(userId, data);
  const createdTask = await taskRepository.findById(userId, newTaskId);
  if (!createdTask) {
    throw new TaskNotFoundError(
      `Task not found after creation. TaskId: ${newTaskId}}`,
    );
  }
  return createdTask;
};

export const createTaskUseCase = taskUsecaseFactory('createTask', createTask);
