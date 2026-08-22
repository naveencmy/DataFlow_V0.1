import cron from 'node-cron';
import { payrollService } from '../modules/payroll/payroll.service.js';
import { logger } from '../config/logger.js';

export function initializeCronJobs() {
  // Run on the 28th of every month at midnight (00:00)
  cron.schedule('0 0 28 * *', async () => {
    logger.info('⏰ Triggering automated monthly payroll processing cron job');
    try {
      const now = new Date();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthIndex = now.getMonth();
      const year = now.getFullYear();
      const month = `${monthNames[monthIndex]} ${year}`;

      const res = await payrollService.processMonthlyPayroll({
        month,
        year,
        monthIndex,
        totalWorkingDays: 22,
      });

      logger.info({ res }, '✅ Automated monthly payroll completed');
    } catch (err) {
      logger.error({ err: err.message }, '❌ Automated payroll cron job failed');
    }
  });

  logger.info('⏱️ Cron scheduler initialized');
}

export default { initializeCronJobs };
