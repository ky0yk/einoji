import { TaskUpdateRuleError } from '../domain/errors/task-errors';
import { Task, toTask } from '../domain/task';
import { updateTaskItemById } from '../infrastructure/ddb/tasks-table';
import { TaskUpdatePartial } from './contracts/ddb-operations';
import { useCaseFactory } from './factory/usecase-factory';

const updateTask = async (
  taskId: string,
  updateData: TaskUpdatePartial,
): Promise<Task> => {
  if (isEmpty(updateData)) {
    throw new TaskUpdateRuleError(
      'Provided data does not follow update rules.',
    );
  }

  const result = await updateTaskItemById(taskId, updateData);

  return toTask(result);
};

const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

export const updateTaskUsecase = useCaseFactory('updateTask', updateTask);
