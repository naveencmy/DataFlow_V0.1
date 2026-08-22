import { z } from 'zod';

export const applyLeaveSchema = z.object({
  leaveType: z.enum(['Paid Time Off', 'Sick Leave', 'Unpaid Leave', 'Casual Leave', 'Maternity/Paternity Leave', 'Other']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be YYYY-MM-DD'),
  totalDays: z.number().positive('Total days must be greater than 0').optional(),
  remarks: z.string().min(3, 'Remarks must provide reason (min 3 characters)'),
  attachmentUrl: z.string().optional(),
  attachmentFileName: z.string().optional(),
});

export const reviewLeaveSchema = z.object({
  status: z.enum(['Approved', 'Rejected']),
  reviewRemarks: z.string().optional(),
});

export const queryLeaveSchema = z.object({
  status: z.string().optional(),
  employeeId: z.string().optional(),
});

export default {
  applyLeaveSchema,
  reviewLeaveSchema,
  queryLeaveSchema,
};
