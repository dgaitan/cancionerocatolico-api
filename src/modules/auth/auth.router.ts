import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { login, logout, refresh, register, verify } from './auth.controller';
import { LoginSchema, RefreshSchema, RegisterSchema, VerifyTokenSchema } from './auth.schema';

import { config } from '../../config/index';

const magicLinkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => config.NODE_ENV === 'test',
});

const router = Router();

router.post('/register', magicLinkLimiter, validate(RegisterSchema), register);
router.post('/login', magicLinkLimiter, validate(LoginSchema), login);
router.post('/verify', validate(VerifyTokenSchema), verify);
router.post('/refresh', validate(RefreshSchema), refresh);
router.post('/logout', authenticate, logout);

export { router as authRouter };
