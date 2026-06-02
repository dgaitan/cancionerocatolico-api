import type { RequestHandler } from 'express';
import createError from 'http-errors';
import { verifyJwt } from '../lib/jwt';

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(createError(401, 'Invalid or expired token'));
    }

    const token = authHeader.slice(7);
    req.user = await verifyJwt(token);
    next();
  } catch {
    next(createError(401, 'Invalid or expired token'));
  }
};
