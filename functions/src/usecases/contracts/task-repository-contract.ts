import { Task } from '../../domain/task';

export type RepoCommand<T, P extends unknown[]> = (...args: P) => Promise<T>;

export type CreateTaskCommand = RepoCommand<string, [CreateTaskPayload]>;
export type GetTaskCommand = RepoCommand<Task | null, [string]>;

export type TaskRepository = {
  create: CreateTaskCommand;
  getById: GetTaskCommand;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
};
