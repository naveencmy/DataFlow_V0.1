import { describe, it, expect } from 'vitest';
import {
  buildDefaultSalaryComponents,
  recalculateComponents,
  calculateDeductions,
  computeLivePayroll,
} from '../utils/salaryEngine.js';

describe('salaryEngine Unit Tests', () => {
  it('correctly calculates default 50% Basic Salary and 50% HRA', () => {
    const monthlyWage = 60000;
    const components = buildDefaultSalaryComponents(monthlyWage);

    const basic = components.find((c) => c.name === 'Basic Salary');
    const hra = components.find((c) => c.name === 'House Rent Allowance (HRA)');
    const fixedBalancing = components.find((c) => c.isBalancing);

    expect(basic?.calculatedAmount).toBe(30000); // 50% of 60k
    expect(hra?.calculatedAmount).toBe(15000); // 50% of Basic (30k)
    expect(fixedBalancing?.calculatedAmount).toBe(6000); // 60k - (30k + 15k + 4k + 3k + 2k) = 6k
  });

  it('computes 12% statutory PF deductions on Basic Wage', () => {
    const basicSalary = 30000;
    const deductions = calculateDeductions(basicSalary, 12, 12, 200);

    expect(deductions.employeePF).toBe(3600); // 12% of 30k
    expect(deductions.employerPF).toBe(3600);
    expect(deductions.professionalTax).toBe(200);
    expect(deductions.totalDeductions).toBe(3800);
  });

  it('calculates live payroll net pay based on payable days', () => {
    const salary = {
      monthlyWage: 60000,
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      components: buildDefaultSalaryComponents(60000),
    };

    const payroll = computeLivePayroll(salary, 20, 0, 0); // 20 working days, 0 leaves
    expect(payroll.payableDays).toBe(20);
    expect(payroll.grossEarnedWage).toBe(60000);
    expect(payroll.netPayable).toBe(60000 - 3800); // 56200
  });

  it('deducts proportionate earned wage for unpaid leaves', () => {
    const salary = {
      monthlyWage: 60000,
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
      components: buildDefaultSalaryComponents(60000),
    };

    const payroll = computeLivePayroll(salary, 20, 2, 0); // 20 working days, 2 unpaid leaves
    expect(payroll.payableDays).toBe(18);
    expect(payroll.grossEarnedWage).toBe(54000); // (60000 / 20) * 18
  });
});
