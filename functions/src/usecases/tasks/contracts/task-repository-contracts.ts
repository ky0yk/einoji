import { Task } from '../../../domain/task/task';
import { RepositoryAction } from '../../base/contract/base-contracts';

export type CreateTaskAction = RepositoryAction<
  string,
  [string, CreateTaskPayload]
>;
export type FindTaskByIdAction = RepositoryAction<
  Task | null,
  [string, string]
>;
export type UpdateTaskAction = RepositoryAction<
  Task,
  [string, string, UpdateTaskAtLeastOne]
>;
export type DeleteTaskAction = RepositoryAction<void, [string, string]>;

export type TaskRepository = {
  create: CreateTaskAction;
  findById: FindTaskByIdAction;
  update: UpdateTaskAction;
  delete: DeleteTaskAction;
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

export type UpdateTaskAtLeastOne = AtLeastOne<UpdateTaskPayload>;
