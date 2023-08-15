import * as z from 'zod';
import { isoDate } from './isoDate';
import { TaskRecord } from './taskRecord';
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

export const CreateTaskRequestSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
});
export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;

export const toTask = (taskRecord: TaskRecord): Task => {
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
