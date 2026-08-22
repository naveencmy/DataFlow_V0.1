import {
  buildDefaultSalaryComponents,
  recalculateComponents,
  calculateDeductions,
  computeLivePayroll,
} from '../../src/shared/utils/salaryEngine.js';

describe('Salary Engine Unit Tests', () => {
  describe('buildDefaultSalaryComponents', () => {
    it('should correctly calculate standard Indian salary components for 85,000 INR', () => {
      const wage = 85000;
      const components = buildDefaultSalaryComponents(wage);

      const basic = components.find((c) => c.name === 'Basic Salary');
      const hra = components.find((c) => c.name === 'House Rent Allowance (HRA)');
      const std = components.find((c) => c.name === 'Standard Allowance');
      const bonus = components.find((c) => c.name === 'Performance Bonus');
      const lta = components.find((c) => c.name === 'Leave Travel Allowance (LTA)');
      const fixed = components.find((c) => c.name.includes('Fixed Allowance'));

      expect(basic.calculatedAmount).toBe(42500); // 50% of 85000
      expect(hra.calculatedAmount).toBe(21250); // 50% of 42500
      expect(std.calculatedAmount).toBe(4000);
      expect(bonus.calculatedAmount).toBe(3000);
      expect(lta.calculatedAmount).toBe(2000);
      expect(fixed.calculatedAmount).toBe(12250); // 85000 - (42500+21250+4000+3000+2000)

      const total = components.reduce((sum, c) => sum + c.calculatedAmount, 0);
      expect(total).toBe(wage);
    });

    it('should handle zero wage gracefully', () => {
      const components = buildDefaultSalaryComponents(0);
      const total = components.reduce((sum, c) => sum + c.calculatedAmount, 0);
      expect(total).toBe(9000); // std(4000) + bonus(3000) + lta(2000)
    });
  });

  describe('recalculateComponents', () => {
    it('should rebalance Fixed Allowance when monthly wage increases', () => {
      const initial = buildDefaultSalaryComponents(75000);
      const recalculated = recalculateComponents(100000, initial);

      expect(recalculated.isValid).toBe(true);
      expect(recalculated.overflowAmount).toBe(0);

      const total = recalculated.components.reduce((sum, c) => sum + c.calculatedAmount, 0);
      expect(total).toBe(100000);
    });

    it('should detect invalid overflow when custom components exceed monthly wage', () => {
      const customComponents = [
        { id: '1', name: 'Basic Salary', calculationType: 'fixed', value: 60000 },
        { id: '2', name: 'Special Allowance', calculationType: 'fixed', value: 50000 },
        { id: '3', name: 'Fixed Allowance (Balancing)', calculationType: 'fixed', value: 0, isBalancing: true },
      ];

      const recalculated = recalculateComponents(100000, customComponents);
      expect(recalculated.isValid).toBe(false);
      expect(recalculated.overflowAmount).toBe(10000); // 110000 - 100000
    });
  });

  describe('calculateDeductions', () => {
    it('should calculate PF and Professional tax accurately', () => {
      const basic = 42500;
      const deductions = calculateDeductions(basic, 12, 12, 200);

      expect(deductions.employeePF).toBe(5100);
      expect(deductions.employerPF).toBe(5100);
      expect(deductions.professionalTax).toBe(200);
      expect(deductions.totalDeductions).toBe(5300);
    });
  });

  describe('computeLivePayroll - Edge Cases', () => {
    const salary = {
      monthlyWage: 85000,
      components: buildDefaultSalaryComponents(85000),
      employeePFPercentage: 12,
      employerPFPercentage: 12,
      professionalTax: 200,
    };

    it('should calculate full salary for standard month (22/22 days)', () => {
      const res = computeLivePayroll(salary, 22, 0, 0);
      expect(res.payableDays).toBe(22);
      expect(res.grossEarnedWage).toBe(85000);
      expect(res.netPayable).toBe(79700); // 85000 - 5300
    });

    it('should calculate proportionate salary with unpaid leave (20/22 days)', () => {
      const res = computeLivePayroll(salary, 22, 2, 0);
      expect(res.payableDays).toBe(20);
      expect(res.grossEarnedWage).toBe(77273); // Math.round((85000/22)*20)
      expect(res.netPayable).toBe(71973); // 77273 - 5300
    });

    it('should handle zero payable days edge case (max unpaid leave)', () => {
      const res = computeLivePayroll(salary, 22, 22, 0);
      expect(res.payableDays).toBe(0);
      expect(res.grossEarnedWage).toBe(0);
      expect(res.netPayable).toBe(0); // Cannot be negative
    });

    it('should handle leap year February (20 or 21 working days)', () => {
      const res = computeLivePayroll(salary, 20, 1, 0);
      expect(res.payableDays).toBe(19);
      expect(res.grossEarnedWage).toBe(80750); // Math.round((85000/20)*19)
    });
  });
});
