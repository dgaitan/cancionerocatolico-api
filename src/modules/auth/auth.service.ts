import crypto from 'node:crypto';
import createError from 'http-errors';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { signJwt, generateRefreshToken, hashRefreshToken } from '../../lib/jwt';
import { sendMagicLink } from '../../lib/mailer';
import { config } from '../../config/index';

type AuthTokens = { accessToken: string; refreshToken: string };

async function createAndSendMagicLink(email: string, expiresMinutes: number): Promise<void> {
  const code = crypto.randomBytes(3).toString('hex');
  const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

  await prisma.magic_link_codes.deleteMany({ where: { email } });
  await prisma.magic_link_codes.create({
    data: {
      email,
      code,
      expires_at: expiresAt,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const magicLink = `${config.WEB_CLIENT_URL}/auth/verify?email=${encodeURIComponent(email)}&token=${code}`;
  await sendMagicLink(email, magicLink, expiresMinutes);
}

export async function registerUser(name: string, email: string, username: string): Promise<void> {
  try {
    await prisma.users.create({
      data: {
        name,
        email,
        username,
        is_active: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const target = String(err.meta?.target ?? '');
      if (target.includes('email')) {
        throw createError(409, 'An account with this email already exists. Please log in.');
      }
      if (target.includes('username')) {
        throw createError(409, 'Username is already taken.');
      }
      throw createError(409, 'Account already exists.');
    }
    throw err;
  }

  await createAndSendMagicLink(email, 60);
}

export async function loginUser(email: string): Promise<void> {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    throw createError(404, 'No account found with this email. Please register.');
  }

  await createAndSendMagicLink(email, 20);
}

export async function verifyMagicLinkToken(email: string, rawCode: string): Promise<AuthTokens> {
  const record = await prisma.magic_link_codes.findFirst({
    where: { email, expires_at: { gt: new Date() } },
  });

  if (!record) {
    throw createError(401, 'Invalid or expired token');
  }

  // Constant-time comparison prevents leaking code validity through response timing.
  const storedBuf = Buffer.from(record.code, 'utf8');
  const incomingBuf = Buffer.from(rawCode, 'utf8');
  const codesMatch =
    storedBuf.length === incomingBuf.length && crypto.timingSafeEqual(storedBuf, incomingBuf);

  // Delete the code unconditionally so a guessed or wrong code can never be reused or brute-forced.
  await prisma.magic_link_codes.delete({ where: { id: record.id } });

  if (!codesMatch) {
    throw createError(401, 'Invalid or expired token');
  }

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    throw createError(401, 'Invalid or expired token');
  }

  await prisma.users.update({
    where: { id: user.id },
    data: {
      email_verified_at: user.email_verified_at ?? new Date(),
      is_active: true,
      updated_at: new Date(),
    },
  });

  const rawRefreshToken = generateRefreshToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.REFRESH_TOKEN_EXPIRES_DAYS);

  await prisma.personal_access_tokens.create({
    data: {
      tokenable_type: 'users',
      tokenable_id: user.id,
      name: 'refresh',
      token: hashRefreshToken(rawRefreshToken),
      abilities: '["refresh"]',
      expires_at: expiresAt,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  return {
    accessToken: signJwt({ userId: String(user.id), email: user.email }),
    refreshToken: rawRefreshToken,
  };
}

export async function refreshAccessToken(rawRefreshToken: string): Promise<AuthTokens> {
  const hashedToken = hashRefreshToken(rawRefreshToken);

  const record = await prisma.personal_access_tokens.findFirst({
    where: {
      token: hashedToken,
      tokenable_type: 'users',
      name: 'refresh',
      expires_at: { gt: new Date() },
    },
  });

  if (!record) {
    throw createError(401, 'Invalid or expired refresh token');
  }

  const user = await prisma.users.findUnique({ where: { id: record.tokenable_id } });
  if (!user) {
    throw createError(401, 'Invalid or expired refresh token');
  }

  const newRawToken = generateRefreshToken();
  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + config.REFRESH_TOKEN_EXPIRES_DAYS);

  await prisma.$transaction([
    prisma.personal_access_tokens.delete({ where: { id: record.id } }),
    prisma.personal_access_tokens.create({
      data: {
        tokenable_type: 'users',
        tokenable_id: user.id,
        name: 'refresh',
        token: hashRefreshToken(newRawToken),
        abilities: '["refresh"]',
        last_used_at: new Date(),
        expires_at: newExpiresAt,
        created_at: new Date(),
        updated_at: new Date(),
      },
    }),
  ]);

  return {
    accessToken: signJwt({ userId: String(user.id), email: user.email }),
    refreshToken: newRawToken,
  };
}

export async function revokeRefreshToken(userId: string): Promise<void> {
  await prisma.personal_access_tokens.deleteMany({
    where: {
      tokenable_type: 'users',
      tokenable_id: BigInt(userId),
      name: 'refresh',
    },
  });
}
