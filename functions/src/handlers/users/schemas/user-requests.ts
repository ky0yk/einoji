import z from 'zod';

export const CreateUserRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type UserCreateRequest = z.infer<typeof CreateUserRequestSchema>;

export const AuthUserRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type UserAuthRequest = z.infer<typeof AuthUserRequestSchema>;
