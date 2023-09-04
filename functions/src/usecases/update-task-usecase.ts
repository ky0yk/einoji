import { TaskUpdateRuleError } from '../domain/errors/task-errors';
import { Task, toTask } from '../domain/task';
import { UpdateTaskRequest } from '../handlers/http/requestSchemas/task-requests';
import { updateTaskItemById } from '../infrastructure/ddb/tasks-table';
import { TaskUpdateAtLeastOne } from './contracts/ddb-operations';
import { useCaseFactory } from './factory/usecase-factory';

const updateTask = async (
  taskId: string,
  updateReq: UpdateTaskRequest,
): Promise<Task> => {
  if (isEmpty(updateReq)) {
    throw new TaskUpdateRuleError(
      'Provided data does not follow update rules.',
    );
  }

  const result = await updateTaskItemById(
    taskId,
    updateReq as TaskUpdateAtLeastOne,
  );

  return toTask(result);
};

const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

export const updateTaskUsecase = useCaseFactory('updateTask', updateTask);
