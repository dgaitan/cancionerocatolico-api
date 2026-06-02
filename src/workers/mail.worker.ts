import { Worker, type Job } from 'bullmq';
import { redisConnection, type MailJobData } from '../lib/queue';
import { deliverMagicLink } from '../lib/mailer';
import { logger } from '../lib/logger';

export function startMailWorker(): Worker<MailJobData> {
  const worker = new Worker<MailJobData>(
    'mail',
    async (job: Job<MailJobData>): Promise<void> => {
      await deliverMagicLink(
        job.data.to,
        job.data.magicLink,
        job.data.expiresMinutes,
      );
    },
    { connection: redisConnection, concurrency: 5 },
  );

  worker.on('completed', (job: Job<MailJobData>): void => {
    logger.info({ jobId: job.id, to: job.data.to }, 'Mail job completed');
  });

  worker.on('failed', (job: Job<MailJobData> | undefined, err: Error): void => {
    logger.error({ jobId: job?.id, err }, 'Mail job failed');
  });

  return worker;
}
