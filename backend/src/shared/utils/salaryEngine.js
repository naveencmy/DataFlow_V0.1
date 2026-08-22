/**
 * Ported Salary Engine for Dayflow HRMS
 * Performs standard Indian payroll computations:
 * - Basic Salary (50% of Wage)
 * - HRA (50% of Basic)
 * - Standard Allowance (Fixed)
 * - Performance Bonus (Fixed)
 * - Leave Travel Allowance (Fixed)
 * - Fixed Allowance (Balancing Component)
 * - Deductions: Employee PF, Employer PF, Professional Tax
 * - Live Payroll Calculation: Days worked / unpaid deductions -> Gross Earned & Net Payable
 * - Work hours & overtime calculation
 */

export function buildDefaultSalaryComponents(monthlyWage) {
  const wage = Number(monthlyWage) || 0;
  // 1. Basic Salary = 50% of Wage
  const basicSalary = Math.round(wage * 0.5);

  // 2. HRA = 50% of Basic
  const hra = Math.round(basicSalary * 0.5);

  // 3. Standard Allowance
  const standardAllowance = 4000;

  // 4. Performance Bonus
  const performanceBonus = 3000;

  // 5. Leave Travel Allowance (LTA)
  const lta = 2000;

  // Sum of fixed & calculated components excluding Fixed Allowance
  const subtotal = basicSalary + hra + standardAllowance + performanceBonus + lta;

  // 6. Fixed Allowance = Wage - subtotal (balancing)
  const fixedAllowance = Math.max(0, wage - subtotal);

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
 * Recalculates all components given a wage and list of custom components
 */
export function recalculateComponents(monthlyWage, components = []) {
  const wage = Number(monthlyWage) || 0;
  let basicSalary = 0;

  // First pass: Calculate percentage components based on Wage and find Basic
  const updated = components.map((comp) => {
    if (comp.name === 'Basic Salary' || comp.id === 'comp-basic') {
      const amt =
        comp.calculationType === 'percentage'
          ? Math.round((wage * Number(comp.value)) / 100)
          : Number(comp.value) || 0;
      basicSalary = amt;
      return { ...comp, calculatedAmount: amt };
    }
    return comp;
  });

  // Second pass: Calculate Basic-dependent components and fixed components
  let nonBalancingTotal = 0;

  const intermediate = updated.map((comp) => {
    if (comp.isBalancing) return comp;

    if (comp.name === 'Basic Salary' || comp.id === 'comp-basic') {
      nonBalancingTotal += comp.calculatedAmount;
      return comp;
    }

    if (comp.calculationType === 'percentage') {
      let amt = 0;
      if (comp.percentageBase === 'Basic Salary') {
        amt = Math.round((basicSalary * Number(comp.value)) / 100);
      } else {
        amt = Math.round((wage * Number(comp.value)) / 100);
      }
      nonBalancingTotal += amt;
      return { ...comp, calculatedAmount: amt };
    } else {
      const amt = Number(comp.value) || 0;
      nonBalancingTotal += amt;
      return { ...comp, calculatedAmount: amt };
    }
  });

  // Third pass: Balance the Fixed Allowance
  const balancingAmount = wage - nonBalancingTotal;
  const isValid = balancingAmount >= 0;
  const overflowAmount = isValid ? 0 : Math.abs(balancingAmount);

  const finalComponents = intermediate.map((comp) => {
    if (comp.isBalancing) {
      return {
        ...comp,
        value: Math.max(0, balancingAmount),
        calculatedAmount: Math.max(0, balancingAmount),
      };
    }
    return comp;
  });

  return {
    components: finalComponents,
    isValid,
    overflowAmount,
  };
}

/**
 * Calculates deductions for PF and Professional Tax
 */
export function calculateDeductions(
  basicSalary,
  employeePFPercentage = 12,
  employerPFPercentage = 12,
  professionalTax = 200
) {
  const basic = Number(basicSalary) || 0;
  const employeePF = Math.round((basic * (Number(employeePFPercentage) || 0)) / 100);
  const employerPF = Math.round((basic * (Number(employerPFPercentage) || 0)) / 100);
  const profTax = Number(professionalTax) || 0;
  const totalDeductions = employeePF + profTax;

  return {
    employeePF,
    employerPF,
    professionalTax: profTax,
    totalDeductions,
  };
}

/**
 * Calculates work hours and extra hours from time strings (e.g. "08:55 AM", "06:30 PM")
 */
export function calculateWorkHours(checkInTime, checkOutTime) {
  if (!checkInTime || !checkOutTime) {
    return { workHours: 0, extraHours: 0 };
  }

  const parseToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const clean = timeStr.trim().toUpperCase();
    const match = clean.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3];

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const inMins = parseToMinutes(checkInTime);
  const outMins = parseToMinutes(checkOutTime);

  let diffMins = outMins - inMins;
  if (diffMins < 0) diffMins += 24 * 60; // handle midnight rollover

  const totalHours = Number((diffMins / 60).toFixed(2));
  const standardHours = 8.0;
  const extraHours = Math.max(0, Number((totalHours - standardHours).toFixed(2)));

  return {
    workHours: totalHours,
    extraHours,
  };
}

/**
 * Live Payroll calculator connecting Attendance / Leave -> Payable Days -> Net Salary
 */
export function computeLivePayroll(
  salary,
  totalWorkingDays = 22,
  unpaidLeaveDays = 0,
  unapprovedAbsentDays = 0
) {
  const totalDays = Number(totalWorkingDays) || 22;
  const unpaid = Number(unpaidLeaveDays) || 0;
  const absent = Number(unapprovedAbsentDays) || 0;

  const payableDays = Math.max(0, totalDays - unpaid - absent);
  const monthlyWage = Number(salary?.monthlyWage) || 0;

  const basicSalaryComp =
    salary?.components?.find((c) => c.name === 'Basic Salary' || c.id === 'comp-basic') ||
    salary?.components?.[0];

  const basicSalary = basicSalaryComp
    ? Number(basicSalaryComp.calculatedAmount) || 0
    : Math.round(monthlyWage * 0.5);

  const deductions = calculateDeductions(
    basicSalary,
    salary?.employeePFPercentage ?? 12,
    salary?.employerPFPercentage ?? 12,
    salary?.professionalTax ?? 200
  );

  // Proportionate monthly earned wage based on payable days
  const perDayWage = totalDays > 0 ? monthlyWage / totalDays : 0;
  const grossEarnedWage = Math.round(perDayWage * payableDays);
  const netPayable = Math.max(0, grossEarnedWage - deductions.totalDeductions);

  return {
    totalWorkingDays: totalDays,
    unpaidLeaveDays: unpaid,
    unapprovedAbsentDays: absent,
    payableDays,
    grossMonthlyWage: monthlyWage,
    grossEarnedWage,
    deductions,
    netPayable,
  };
}

export default {
  buildDefaultSalaryComponents,
  recalculateComponents,
  calculateDeductions,
  calculateWorkHours,
  computeLivePayroll,
};
