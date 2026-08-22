import { z } from 'zod';

export const checkInSchema = z.object({
  notes: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD').optional(),
});

export const checkOutSchema = z.object({
  notes: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD').optional(),
});

export const queryAttendanceSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  month: z.string().optional(),
  employeeId: z.string().optional(),
});

export default {
  checkInSchema,
  checkOutSchema,
  queryAttendanceSchema,
};
