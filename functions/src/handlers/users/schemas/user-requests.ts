import z from 'zod';

export const CreateUserRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(64),
});

export type UserCreateRequest = z.infer<typeof CreateUserRequestSchema>;
