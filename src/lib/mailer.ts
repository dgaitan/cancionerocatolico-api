import nodemailer from 'nodemailer';
import { config } from '../config/index';

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_SECURE,
  ...(config.SMTP_USER && config.SMTP_PASS
    ? { auth: { user: config.SMTP_USER, pass: config.SMTP_PASS } }
    : {}),
});

export async function sendMagicLink(to: string, magicLink: string): Promise<void> {
  await transporter.sendMail({
    from: config.EMAIL_FROM,
    to,
    subject: 'Your login link — Cancionero Católico',
    text: `Click this link to sign in (expires in ${config.MAGIC_LINK_EXPIRES_MINUTES} minutes):\n\n${magicLink}\n\nIf you did not request this, you can safely ignore it.`,
    html: `<p>Click the link below to sign in. It expires in <strong>${config.MAGIC_LINK_EXPIRES_MINUTES} minutes</strong>.</p><p><a href="${magicLink}">${magicLink}</a></p><p>If you did not request this, you can safely ignore it.</p>`,
  });
}
