import { CreateTaskData, Task } from '../domain/task';
import { TaskNotFoundError } from '../domain/errors/task-errors';
import { useCaseFactory } from './factory/usecase-factory';
import { taskRepository } from '../infrastructure/ddb/task-repository';

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

export const createTaskUseCase = useCaseFactory('createTask', createTask);
