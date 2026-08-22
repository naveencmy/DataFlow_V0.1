import { Queue, Worker } from 'bullmq';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { sendEmail } from '../shared/utils/emailService.js';

const redisConnection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};

let emailQueue = null;
let emailWorker = null;

try {
  emailQueue = new Queue('email-queue', { connection: redisConnection });

  emailWorker = new Worker(
    'email-queue',
    async (job) => {
      logger.info({ jobId: job.id, to: job.data.to }, 'Processing queued email job');
      await sendEmail(job.data);
    },
    { connection: redisConnection }
  );

  emailWorker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Queued email job finished successfully');
  });

  emailWorker.on('failed', (job, err) => {
    logger.warn({ jobId: job?.id, err: err.message }, 'Queued email job failed');
  });
} catch (e) {
  logger.warn('BullMQ worker disabled, running sync email delivery');
}

export async function queueEmail(emailData) {
  if (emailQueue) {
    try {
      return await emailQueue.add('send-email', emailData, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      });
    } catch (e) {
      return sendEmail(emailData);
    }
  }
  return sendEmail(emailData);
}

export default {
  emailQueue,
  emailWorker,
  queueEmail,
};
