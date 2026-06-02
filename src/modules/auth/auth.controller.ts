import type { RequestHandler } from 'express';
import { ok } from '../../lib/response';
import { asyncHandler } from '../../utils/asyncHandler';
import { loginUser, refreshAccessToken, registerUser, revokeRefreshToken, verifyMagicLinkToken } from './auth.service';
import type { LoginDto, RefreshDto, RegisterDto, VerifyTokenDto } from './auth.schema';

export const register: RequestHandler = asyncHandler(async (req, res) => {
  const { name, email, username } = req.body as RegisterDto;
  await registerUser(name, email, username);
  res.status(201).json(ok({ message: 'Account created. Check your email for a magic link.' }));
});

export const login: RequestHandler = asyncHandler(async (req, res) => {
  const { email } = req.body as LoginDto;
  await loginUser(email);
  res.json(ok({ message: 'Magic link sent to your email.' }));
});

export const verify: RequestHandler = asyncHandler(async (req, res) => {
  const { email, token } = req.body as VerifyTokenDto;
  const tokens = await verifyMagicLinkToken(email, token);
  res.json(ok(tokens));
});

export const refresh: RequestHandler = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body as RefreshDto;
  const tokens = await refreshAccessToken(refreshToken);
  res.json(ok(tokens));
});

export const logout: RequestHandler = asyncHandler(async (req, res) => {
  await revokeRefreshToken(req.user!.userId);
  res.json(ok({ message: 'Logged out successfully.' }));
});
