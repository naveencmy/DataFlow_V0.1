import { describe, it, expect } from 'vitest';
import { generateSystemLoginId, generateLoginId, generateInitialPassword } from '../utils/idGenerator.js';

describe('idGenerator Unit Tests', () => {
  it('generates system login ID conforming to [CompanyPrefix][First2First][First2Last][Year][Serial]', () => {
    const id = generateSystemLoginId('John Doe', 'Odoo India', 2022, []);
    expect(id).toBe('OIJODO20220001');
  });

  it('increments serial number based on existing employee count for the year', () => {
    const existing = [
      { loginId: 'OIJODO20260001' },
      { loginId: 'OISMIT20260002' },
    ];
    const id = generateSystemLoginId('Alex Johnson', 'Odoo India', 2026, existing);
    expect(id).toBe('OIALJO20260003');
  });

  it('handles single word names gracefully', () => {
    const id = generateSystemLoginId('Prince', 'Dayflow Tech', 2026, []);
    expect(id).toBe('DTPRPR20260001');
  });

  it('generates secure initial temporary password prefixed with Dayflow@', () => {
    const pass = generateInitialPassword();
    expect(pass.startsWith('Dayflow@')).toBe(true);
    expect(pass.length).toBeGreaterThanOrEqual(16);
  });
});
