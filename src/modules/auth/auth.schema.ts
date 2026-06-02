import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
});

export const LoginSchema = z.object({
  email: z.string().email(),
});

export const VerifyTokenSchema = z.object({
  email: z.string().email(),
  token: z.string().length(6),
});

export const RefreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
export type VerifyTokenDto = z.infer<typeof VerifyTokenSchema>;
export type RefreshDto = z.infer<typeof RefreshSchema>;
