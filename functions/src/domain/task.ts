import * as z from 'zod';
import { isoDate } from './isoDate';

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  completed: z.boolean(),
  description: z.string().optional(),
  createdAt: isoDate,
  updatedAt: isoDate,
});

export type Task = z.infer<typeof TaskSchema>;

export type CreateTaskData = {
  title: string;
  description?: string;
};
