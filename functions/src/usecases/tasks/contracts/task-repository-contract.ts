import { RepositoryAction } from '../../contracts/base-contracts';
import { Task } from '../../../domain/task';

export type CreateTaskAction = RepositoryAction<string, [CreateTaskPayload]>;
export type FindTaskByIdAction = RepositoryAction<Task | null, [string]>;
export type UpdateTaskAction = RepositoryAction<
  Task,
  [string, UpdateTaskAtLeastOne]
>;
export type DeleteTaskAction = RepositoryAction<void, [string]>;

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
