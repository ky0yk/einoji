import * as z from 'zod';
import { isoDate } from '../../../domain/isoDate';
import { Task, TaskSchema } from '../../../domain/task';
import { DdbInternalServerError } from '../errors/ddb-errors';

export const TaskItemSchema = z.object({
  userId: z.string().uuid(),
  taskId: z.string().uuid(),
  title: z.string(),
  completed: z.boolean(),
  description: z.string().optional(),
  createdAt: isoDate,
  updatedAt: isoDate,
});

export type TaskItem = z.infer<typeof TaskItemSchema>;

export const toTask = (item: TaskItem): Task => {
  const interimTask = {
    id: item.taskId,
    title: item.title,
    description: item.description,
    completed: item.completed,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };

  const result = TaskSchema.safeParse(interimTask);

  if (!result.success) {
    throw new DdbInternalServerError(
      `Failed to convert data to Task. Errors: ${result.error.message}`,
    );
  }

  return result.data;
};
