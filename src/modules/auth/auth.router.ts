import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middleware/validate';
import { requestLink, verifyToken } from './auth.controller';
import { RequestLinkSchema, VerifyTokenSchema } from './auth.schema';

const magicLinkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post('/request-link', magicLinkLimiter, validate(RequestLinkSchema), requestLink);
router.get('/verify', validate(VerifyTokenSchema, 'query'), verifyToken);

export { router as authRouter };
