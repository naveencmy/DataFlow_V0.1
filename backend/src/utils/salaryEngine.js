// ─── Salary Engine (ported from frontend utils/salaryEngine.js) ───────────────

/**
 * Builds default salary component breakdown from monthly wage.
 * Basic = 50% of Wage, HRA = 50% of Basic, Fixed Allowance balances the rest.
 */
export function buildDefaultSalaryComponents(monthlyWage) {
  const basicSalary = Math.round(monthlyWage * 0.5);
  const hra = Math.round(basicSalary * 0.5);
  const standardAllowance = 4000;
  const performanceBonus = 3000;
  const lta = 2000;
  const subtotal = basicSalary + hra + standardAllowance + performanceBonus + lta;
  const fixedAllowance = Math.max(0, monthlyWage - subtotal);

  return [
    {
      id: 'comp-basic',
      name: 'Basic Salary',
      calculationType: 'percentage',
      value: 50,
      percentageBase: 'Wage',
      calculatedAmount: basicSalary,
    },
    {
      id: 'comp-hra',
      name: 'House Rent Allowance (HRA)',
      calculationType: 'percentage',
      value: 50,
      percentageBase: 'Basic Salary',
      calculatedAmount: hra,
    },
    {
      id: 'comp-std',
      name: 'Standard Allowance',
      calculationType: 'fixed',
      value: standardAllowance,
      calculatedAmount: standardAllowance,
    },
    {
      id: 'comp-bonus',
      name: 'Performance Bonus',
      calculationType: 'fixed',
      value: performanceBonus,
      calculatedAmount: performanceBonus,
    },
    {
      id: 'comp-lta',
      name: 'Leave Travel Allowance (LTA)',
      calculationType: 'fixed',
      value: lta,
      calculatedAmount: lta,
    },
    {
      id: 'comp-fixed-allowance',
      name: 'Fixed Allowance (Balancing)',
      calculationType: 'fixed',
      value: fixedAllowance,
      calculatedAmount: fixedAllowance,
      isBalancing: true,
    },
  ];
}

/**
 * Calculates deductions: Employee PF, Employer PF, Professional Tax
 */
export function calculateDeductions(
  basicSalary,
  employeePFPercentage = 12,
  employerPFPercentage = 12,
  professionalTax = 200
) {
  const employeePF = Math.round((basicSalary * employeePFPercentage) / 100);
  const employerPF = Math.round((basicSalary * employerPFPercentage) / 100);
  const totalDeductions = employeePF + professionalTax;
  return { employeePF, employerPF, professionalTax, totalDeductions };
}

/**
 * Computes live payroll: Attendance/Leave → Payable Days → Net Salary
 */
export function computeLivePayroll(salary, totalWorkingDays = 22, unpaidLeaveDays = 0) {
  const payableDays = Math.max(0, totalWorkingDays - unpaidLeaveDays);
  const wage = salary?.monthlyWage || 0;
  const basicSalaryComp = salary?.components?.find((c) => c.name === 'Basic Salary');
  const basicSalary = basicSalaryComp ? basicSalaryComp.calculatedAmount : Math.round(wage * 0.5);

  const deductions = calculateDeductions(
    basicSalary,
    salary?.employeePFPercentage || 12,
    salary?.employerPFPercentage || 12,
    salary?.professionalTax || 200
  );

  const perDayWage = totalWorkingDays > 0 ? wage / totalWorkingDays : 0;
  const grossEarnedWage = Math.round(perDayWage * payableDays);
  const netPayable = Math.max(0, grossEarnedWage - deductions.totalDeductions);

  return {
    totalWorkingDays,
    unpaidLeaveDays,
    payableDays,
    grossMonthlyWage: wage,
    grossEarnedWage,
    deductions,
    netPayable,
  };
}
