import { TaskItem } from '../../infrastructure/ddb/schemas/taskItem';

export type DdbOperation<T, P extends unknown[]> = (...args: P) => Promise<T>;

export type CreateTaskItem = DdbOperation<string, [CreateTaskPayload]>;
export type GetTaskItem = DdbOperation<TaskItem | null, [string]>;
export type UpdateTaskItem = DdbOperation<
  TaskItem,
  [string, TaskUpdateAtLeastOne]
>;

export type CreateTaskPayload = {
  title: string;
  description?: string;
};

type UpdateTaskPayload = {
  title: string;
  description: string;
};

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type TaskUpdateAtLeastOne = AtLeastOne<UpdateTaskPayload>;
