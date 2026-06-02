import type { RequestHandler } from 'express';
import { type ZodTypeAny, ZodError } from 'zod';

export function validate(
  schema: ZodTypeAny,
  source: 'body' | 'query' | 'params' = 'body',
): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(new ZodError(result.error.issues));
    }
    // Attach parsed data to req for body; for query/params in Express 5,
    // write to a separate validated namespace since those are read-only getters.
    if (source === 'body') {
      req.body = result.data;
    } else {
      (req as unknown as { validated: Record<string, unknown> }).validated ??= {};
      (req as unknown as { validated: Record<string, unknown> }).validated[source] = result.data;
    }
    next();
  };
}
