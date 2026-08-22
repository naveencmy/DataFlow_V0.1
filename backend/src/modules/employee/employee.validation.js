import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  jobPosition: z.string().min(1, 'Job position is required'),
  manager: z.string().optional(),
  location: z.string().optional().default('Bangalore Tech Hub'),
  company: z.string().optional().default('Dayflow Technologies Pvt Ltd'),
  dateOfJoining: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  dateOfBirth: z.string().optional(),
  residentialAddress: z.string().optional(),
  nationality: z.string().optional().default('Indian'),
  personalEmail: z.string().email().optional().or(z.literal('')),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  about: z.string().optional(),
  whatILoveAboutMyJob: z.string().optional(),
  interestsAndHobbies: z.string().optional(),
  skills: z.array(z.any()).optional().default([]),
  certifications: z.array(z.any()).optional().default([]),
  documents: z.array(z.any()).optional().default([]),
  bankDetails: z.record(z.any()).optional().default({}),
  salary: z.record(z.any()).optional().default({}),
});

export const updateEmployeeSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  mobile: z.string().optional(),
  profilePicture: z.string().optional(),
  department: z.string().optional(),
  jobPosition: z.string().optional(),
  manager: z.string().optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  dateOfJoining: z.string().optional(),
  dateOfBirth: z.string().optional(),
  residentialAddress: z.string().optional(),
  nationality: z.string().optional(),
  personalEmail: z.string().email().optional().or(z.literal('')),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  about: z.string().optional(),
  whatILoveAboutMyJob: z.string().optional(),
  interestsAndHobbies: z.string().optional(),
  skills: z.array(z.any()).optional(),
  certifications: z.array(z.any()).optional(),
  documents: z.array(z.any()).optional(),
  bankDetails: z.record(z.any()).optional(),
  salary: z.record(z.any()).optional(),
});

export const queryEmployeeSchema = z.object({
  page: z.string().transform(Number).optional().default('1'),
  limit: z.string().transform(Number).optional().default('20'),
  search: z.string().optional(),
  department: z.string().optional(),
});

export default {
  createEmployeeSchema,
  updateEmployeeSchema,
  queryEmployeeSchema,
};
