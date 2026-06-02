import type { RequestHandler } from 'express';
import createError from 'http-errors';

export const notFound: RequestHandler = (_req, _res, next) => {
  next(createError(404, 'Route not found'));
};
