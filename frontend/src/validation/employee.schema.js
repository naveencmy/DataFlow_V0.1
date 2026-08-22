import { z } from 'zod';

export const EmployeeCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').trim(),
  phone: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  jobPosition: z.string().min(1, 'Job position is required'),
  joiningDate: z.string().min(1, 'Date of joining is required'),
  location: z.string().default('Bangalore Tech Hub'),
  monthlyWage: z.coerce.number().min(10000, 'Monthly wage must be at least ₹10,000'),
  about: z.string().optional(),
  bankDetails: z
    .object({
      accountNumber: z.string().optional(),
      bankName: z.string().optional(),
      ifscCode: z.string().optional(),
      panNumber: z.string().optional(),
      uanNumber: z.string().optional(),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string().optional(),
      relationship: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
});

export const EmployeeEditSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  jobPosition: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
  isDeactivated: z.boolean().optional(),
});

export const SalaryUpdateSchema = z.object({
  monthlyWage: z.coerce.number().min(10000, 'Monthly wage must be at least ₹10,000'),
  wageType: z.string().default('Fixed Wage'),
  employeePFPercentage: z.coerce.number().min(0).max(20).default(12),
  employerPFPercentage: z.coerce.number().min(0).max(20).default(12),
  professionalTax: z.coerce.number().min(0).default(200),
  workingDaysPerWeek: z.coerce.number().min(4).max(7).default(5),
  breakTimeMinutes: z.coerce.number().min(0).default(60),
});
