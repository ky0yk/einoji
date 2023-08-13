import * as z from 'zod';
import { isoDate } from './isoDate';

export const TaskRecordSchema = z.object({
  userId: z.string().uuid(),
  taskId: z.string().uuid(),
  title: z.string(),
  completed: z.boolean(),
  description: z.string().optional(),
  createdAt: isoDate,
  updatedAt: isoDate,
});

export type TaskRecord = z.infer<typeof TaskRecordSchema>;
