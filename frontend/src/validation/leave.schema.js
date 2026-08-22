import { z } from 'zod';

export const LeaveApplySchema = z
  .object({
    leaveType: z.enum(['Paid Time Off', 'Sick Leave', 'Unpaid Leave'], {
      errorMap: () => ({ message: 'Please select a valid leave category' }),
    }),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    remarks: z.string().min(3, 'Please provide a reason (minimum 3 characters)').trim(),
    attachmentFileName: z.string().optional(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

export const LeaveReviewSchema = z.object({
  status: z.enum(['Approved', 'Rejected'], {
    errorMap: () => ({ message: 'Status must be Approved or Rejected' }),
  }),
  reviewRemarks: z.string().optional(),
});
