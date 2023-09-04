import { Task, toTask } from '../domain/task';
import { updateTaskItemById } from '../infrastructure/ddb/tasks-table';
import { TaskUpdatePartial } from './contracts/ddb-operations';
import { useCaseFactory } from './factory/usecase-factory';

const updateTask = async (
  taskId: string,
  body: TaskUpdatePartial,
): Promise<Task> => {
  if (isEmpty(body)) {
    throw new Error('UpdateTaskRequest is empty');
  }

  const result = await updateTaskItemById(taskId, body);

  return toTask(result);
};

const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

export const updateTaskUsecase = useCaseFactory('updateTask', updateTask);
