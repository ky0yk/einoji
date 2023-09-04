import { TaskItem } from '../../domain/taskItem';
import { CreateTaskRequest } from '../../handlers/http/requestSchemas/create-task-request';

export type DdbOperation<T, P extends unknown[]> = (...args: P) => Promise<T>;

export type CreateTaskItem = DdbOperation<string, [CreateTaskRequest]>;
export type GetTaskItem = DdbOperation<TaskItem | null, [string]>;
export type UpdateTaskItem = DdbOperation<
  TaskItem,
  [string, TaskUpdatePartial]
>;

type TaskUpdateData = {
  title: string;
  description: string;
};

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type TaskUpdatePartial = AtLeastOne<TaskUpdateData>;
