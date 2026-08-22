import { z } from 'zod';

export const createNotificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['leave', 'payroll', 'attendance', 'system']).default('system'),
  userId: z.string().optional(),
  employeeId: z.string().optional(),
});

export default {
  createNotificationSchema,
};
