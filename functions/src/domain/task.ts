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

export const toTask = (taskRecord: TaskItem): Task => {
  try {
    return {
      id: taskRecord.taskId,
      title: taskRecord.title,
      description: taskRecord.description,
      completed: taskRecord.completed,
      createdAt: taskRecord.createdAt,
      updatedAt: taskRecord.updatedAt,
    };
  } catch (error) {
    throw new TaskConversionError('Failed to convert TaskRecord to Task');
  }
};
