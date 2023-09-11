import { Task } from '../../domain/task';

export type RepoCommand<T, P extends unknown[]> = (...args: P) => Promise<T>;

export type CreateTaskCommand = RepoCommand<string, [CreateTaskPayload]>;
export type GetTaskCommand = RepoCommand<Task | null, [string]>;
export type UpdateTaskCommand = RepoCommand<
  Task,
  [string, TaskUpdateAtLeastOne]
>;

export type TaskRepository = {
  create: CreateTaskCommand;
  getById: GetTaskCommand;
  update: UpdateTaskCommand;
};

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
