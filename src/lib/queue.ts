import IORedis from 'ioredis';
import { Queue } from 'bullmq';
import { config } from '../config/index';

// maxRetriesPerRequest: null is REQUIRED by BullMQ — without it BullMQ throws
export const redisConnection = new IORedis(config.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export type MailJobData = {
  to: string;
  magicLink: string;
  expiresMinutes: number;
};

export const mailQueue = new Queue<MailJobData>('mail', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5_000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});
