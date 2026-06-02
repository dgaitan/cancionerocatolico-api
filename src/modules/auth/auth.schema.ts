import { z } from 'zod';

export const RequestLinkSchema = z.object({
  email: z.string().email(),
});

// Both email and token are required to verify — they're embedded in the magic link URL
export const VerifyTokenSchema = z.object({
  email: z.string().email(),
  token: z.string().length(6),
});

export type RequestLinkDto = z.infer<typeof RequestLinkSchema>;
export type VerifyTokenDto = z.infer<typeof VerifyTokenSchema>;
