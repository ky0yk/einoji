import { TaskUpdateRuleError } from '../../domain/task/errors/task-errors';
import { Task, UpdateTaskData } from '../../domain/task/task';
import { taskRepository } from '../../infrastructure/ddb/task-repository';
import { taskUsecaseFactory } from './factory/task-usecase-factory';
import { UpdateTaskAtLeastOne } from './contracts/task-repository-contracts';

const updateTask = async (
  userId: string,
  taskId: string,
  data: UpdateTaskData,
): Promise<Task> => {
  if (isEmpty(data)) {
    throw new TaskUpdateRuleError(
      'Provided data does not follow update rules.',
    );
  }

  return await taskRepository.update(
    userId,
    taskId,
    data as UpdateTaskAtLeastOne,
  );
};

const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

export const updateTaskUsecase = taskUsecaseFactory('updateTask', updateTask);
