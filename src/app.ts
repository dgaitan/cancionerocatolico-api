import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';
import rateLimit from 'express-rate-limit';
import { logger } from './lib/logger';
import { config } from './config/index';
import { authRouter } from './modules/auth/auth.router';
import { songsRouter } from './modules/songs/songs.router';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  // Serialize BigInt (Prisma IDs) as strings in JSON responses
  app.set('json replacer', (_key: string, value: unknown) =>
    typeof value === 'bigint' ? String(value) : value,
  );

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(pinoHttp({ logger }));
  app.use(express.json());

  app.use(
    rateLimit({
      windowMs: config.RATE_LIMIT_WINDOW_MS,
      max: config.RATE_LIMIT_MAX_REQUESTS,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/auth', authRouter);
  app.use('/songs', songsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
