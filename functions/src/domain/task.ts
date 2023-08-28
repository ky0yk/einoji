import * as z from 'zod';
import { isoDate } from './isoDate';
import { TaskItem } from './taskItem';
import { TaskConversionError } from './errors/task-errors';

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  completed: z.boolean(),
  description: z.string().optional(),
  createdAt: isoDate,
  updatedAt: isoDate,
});

export type Task = z.infer<typeof TaskSchema>;

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
    throw new TaskConversionError(
      `Failed to convert TaskItem to Task. Errors: ${result.error.message}`,
    );
  }

  return result.data;
};
