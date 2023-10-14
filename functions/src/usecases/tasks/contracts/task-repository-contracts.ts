import { Task } from '../../../domain/task/task';
import { InfraAction } from '../../base/contract/base-contracts';

export type CreateTaskAction = InfraAction<string, [string, CreateTaskPayload]>;
export type FindTaskByIdAction = InfraAction<Task | null, [string, string]>;
export type UpdateTaskAction = InfraAction<
  Task,
  [string, string, UpdateTaskAtLeastOne]
>;
export type DeleteTaskAction = InfraAction<void, [string, string]>;

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
