import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().optional(),
  role: z.enum(['ADMIN', 'HR', 'EMPLOYEE']).optional().default('EMPLOYEE'),
  companyName: z.string().optional().default('Dayflow Technologies Pvt Ltd'),
  company: z.string().optional(),
  department: z.string().optional().default('General'),
  jobPosition: z.string().optional().default('Team Member'),
  phone: z.string().optional(),
  mobile: z.string().optional(),
}).passthrough();

export const loginSchema = z.object({
  identifier: z.string().optional(),
  loginId: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(data => data.identifier || data.loginId || data.email, {
  message: 'Login ID or Email is required',
  path: ['loginId'],
});

export const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export default {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
