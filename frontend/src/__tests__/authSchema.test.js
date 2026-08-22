import { describe, it, expect } from 'vitest';
import { LoginSchema, SignUpSchema, ChangePasswordSchema } from '../validation/auth.schema.js';

describe('Auth Zod Schemas Unit Tests', () => {
  it('validates correct login credentials', () => {
    const result = LoginSchema.safeParse({
      loginId: 'admin@dayflow.internal',
      password: 'admin123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty login fields', () => {
    const result = LoginSchema.safeParse({
      loginId: '',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('validates strong passwords for signup', () => {
    const valid = SignUpSchema.safeParse({
      companyName: 'Odoo India',
      name: 'John Doe',
      email: 'john.doe@dayflow.internal',
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
      role: 'EMPLOYEE',
      department: 'Engineering',
      jobPosition: 'Developer',
    });
    expect(valid.success).toBe(true);

    const weak = SignUpSchema.safeParse({
      companyName: 'Odoo India',
      name: 'John Doe',
      email: 'john.doe@dayflow.internal',
      password: 'short',
      confirmPassword: 'short',
      role: 'EMPLOYEE',
      department: 'Engineering',
      jobPosition: 'Developer',
    });
    expect(weak.success).toBe(false);
  });

  it('ensures password and confirm password match', () => {
    const mismatch = ChangePasswordSchema.safeParse({
      currentPassword: 'oldPass',
      newPassword: 'NewPassword123!',
      confirmPassword: 'DifferentPassword123!',
    });
    expect(mismatch.success).toBe(false);
  });
});
