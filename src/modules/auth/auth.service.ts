import crypto from 'node:crypto';
import createError from 'http-errors';
import { prisma } from '../../config/prisma';
import { signJwt } from '../../lib/jwt';
import { sendMagicLink } from '../../lib/mailer';
import { config } from '../../config/index';

function generateCode(): string {
  // 3 random bytes → 6 hex chars, e.g. "a3f9c2"
  return crypto.randomBytes(3).toString('hex');
}

export async function requestMagicLink(email: string): Promise<void> {
  const user = await prisma.users.findUnique({ where: { email } });

  // Always resolve silently — never reveal whether an account exists
  if (!user) return;

  const code = generateCode();
  const expiresAt = new Date(Date.now() + config.MAGIC_LINK_EXPIRES_MINUTES * 60 * 1000);

  // Delete any previous codes for this email, then create fresh one
  await prisma.magic_link_codes.deleteMany({ where: { email } });
  await prisma.magic_link_codes.create({
    data: { email, code, expires_at: expiresAt },
  });

  const magicLink = `${config.APP_URL}/auth/verify?email=${encodeURIComponent(email)}&token=${code}`;
  await sendMagicLink(email, magicLink);
}

export async function verifyMagicLink(email: string, rawCode: string): Promise<string> {
  const record = await prisma.magic_link_codes.findFirst({
    where: { email, expires_at: { gt: new Date() } },
  });

  if (!record) {
    throw createError(401, 'Invalid or expired token');
  }

  // Constant-time comparison to prevent timing attacks
  const storedBuf = Buffer.from(record.code, 'utf8');
  const incomingBuf = Buffer.from(rawCode, 'utf8');

  const codesMatch =
    storedBuf.length === incomingBuf.length &&
    crypto.timingSafeEqual(storedBuf, incomingBuf);

  // Delete the code regardless of outcome to prevent brute-force
  await prisma.magic_link_codes.delete({ where: { id: record.id } });

  if (!codesMatch) {
    throw createError(401, 'Invalid or expired token');
  }

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    throw createError(401, 'Invalid or expired token');
  }

  return signJwt({ userId: String(user.id), email: user.email });
}
