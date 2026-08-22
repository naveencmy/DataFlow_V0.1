import { z } from 'zod';

export const processPayrollSchema = z.object({
  month: z.string().min(1, 'Month name is required e.g. August 2026'),
  year: z.number().int().min(2020).max(2050),
  monthIndex: z.number().int().min(0).max(11),
  totalWorkingDays: z.number().int().positive().default(22),
});

export const queryPayrollSchema = z.object({
  year: z.string().transform(Number).optional(),
  month: z.string().optional(),
  employeeId: z.string().optional(),
});

export default {
  processPayrollSchema,
  queryPayrollSchema,
};
