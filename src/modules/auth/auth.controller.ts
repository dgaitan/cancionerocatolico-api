import type { RequestHandler } from 'express';
import { ok } from '../../lib/response';
import { asyncHandler } from '../../utils/asyncHandler';
import { requestMagicLink, verifyMagicLink } from './auth.service';
import type { RequestLinkDto, VerifyTokenDto } from './auth.schema';

export const requestLink: RequestHandler = asyncHandler(async (req, res) => {
  const { email } = req.body as RequestLinkDto;
  await requestMagicLink(email);
  res.json(ok({ message: 'If an account exists, a magic link has been sent.' }));
});

export const verifyToken: RequestHandler = asyncHandler(async (req, res) => {
  const { email, token } = (req.validated?.['query'] ?? req.query) as VerifyTokenDto;
  const accessToken = await verifyMagicLink(email, token);
  res.json(ok({ token: accessToken }));
});
