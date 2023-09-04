import * as z from 'zod';

export const CreateTaskRequestSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
});
export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;

export const UpdateTaskRequestSchema = z
  .object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(1000).optional(),
  })
  .transform((data) => {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );
  });
