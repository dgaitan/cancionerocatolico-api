import type { ErrorRequestHandler } from 'express';
import { isHttpError } from 'http-errors';
import { ZodError } from 'zod';
import { fail } from '../lib/response';
import { logger } from '../lib/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(422).json(fail('Validation failed', 'VALIDATION_ERROR', err.flatten()));
    return;
  }

  if (isHttpError(err)) {
    res.status(err.status).json(fail(err.message, err.name));
    return;
  }

  // Prisma "record not found"
  if (err?.code === 'P2025') {
    res.status(404).json(fail('Resource not found', 'NOT_FOUND'));
    return;
  }

  logger.error({ err, url: req.url, method: req.method }, 'Unhandled error');

  const message =
    process.env['NODE_ENV'] === 'production' ? 'Internal server error' : (err.message ?? 'Internal server error');

  res.status(500).json(fail(message, 'INTERNAL_ERROR'));
};
