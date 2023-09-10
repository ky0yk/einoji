import { CreateTaskData, Task } from '../domain/task';
import { TaskNotFoundError } from '../domain/errors/task-errors';
import { useCaseFactory } from './factory/usecase-factory';
import {
  createTaskItem,
  getTaskItemById,
} from '../infrastructure/ddb/tasks-table';
import { toTask } from '../infrastructure/ddb/schemas/taskItem';

const createTask = async (data: CreateTaskData): Promise<Task> => {
  const newTaskId = await createTaskItem(data);
  const newTaskRecord = await getTaskItemById(newTaskId);
  if (!newTaskRecord) {
    throw new TaskNotFoundError(
      `Task not found after creation. TaskId: ${newTaskId}}`,
    );
  }
  return toTask(newTaskRecord);
};

export const createTaskUseCase = useCaseFactory('createTask', createTask);
