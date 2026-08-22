import { z } from 'zod';

export const LoginSchema = z.object({
  loginId: z
    .string()
    .min(1, 'Login ID or Email is required')
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const SignUpSchema = z
  .object({
    companyName: z
      .string()
      .min(2, 'Company name must be at least 2 characters')
      .default('Odoo India'),
    name: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .trim(),
    email: z
      .string()
      .email('Invalid email address')
      .toLowerCase()
      .trim(),
    phone: z
      .string()
      .optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    role: z
      .enum(['EMPLOYEE', 'ADMIN'])
      .default('ADMIN'),
    department: z
      .string()
      .default('Management'),
    jobPosition: z
      .string()
      .default('HR Administrator'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const OtpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least 1 uppercase letter')
      .regex(/[0-9]/, 'Must contain at least 1 number'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
