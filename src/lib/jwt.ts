import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config/index';

export function signJwt(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

export function verifyJwt(token: string): { userId: string; email: string } {
  const decoded = jwt.verify(token, config.JWT_SECRET);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }
  return { userId: decoded['userId'] as string, email: decoded['email'] as string };
}
