import { CreateTaskData, Task } from '../../domain/task/task';
import { TaskNotFoundError } from '../../domain/task/errors/task-errors';
import { taskRepository } from '../../infrastructure/ddb/task-repository';
import { taskUseCaseFactory } from './factory/task-usecase-factory';

const createTask = async (data: CreateTaskData): Promise<Task> => {
  const newTaskId = await taskRepository.create(data);
  const createdTask = await taskRepository.findById(newTaskId);
  if (!createdTask) {
    throw new TaskNotFoundError(
      `Task not found after creation. TaskId: ${newTaskId}}`,
    );
  }
  return createdTask;
};

export const createTaskUseCase = taskUseCaseFactory('createTask', createTask);
