import { TaskUpdateRuleError } from '../domain/errors/task-errors';
import { Task, UpdateTaskData } from '../domain/task';
import { taskRepository } from '../infrastructure/ddb/task-repository';
import { TaskUpdateAtLeastOne } from './contracts/task-repository-contract';
import { useCaseFactory } from './factory/usecase-factory';

const updateTask = async (
  taskId: string,
  data: UpdateTaskData,
): Promise<Task> => {
  if (isEmpty(data)) {
    throw new TaskUpdateRuleError(
      'Provided data does not follow update rules.',
    );
  }

  return await taskRepository.update(taskId, data as TaskUpdateAtLeastOne);
};

const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

export const updateTaskUsecase = useCaseFactory('updateTask', updateTask);