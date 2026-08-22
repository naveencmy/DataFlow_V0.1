/**
 * Default standard salary components per Section 11:
 * - Basic Salary (50% of Wage)
 * - HRA (50% of Basic Salary)
 * - Standard Allowance (Fixed)
 * - Performance Bonus (Fixed)
 * - Leave Travel Allowance (LTA) (Fixed)
 * - Fixed Allowance (Balancing component = Wage - Total of all other components)
 */

export function buildDefaultSalaryComponents(monthlyWage) {
  // 1. Basic Salary = 50% of Wage
  const basicSalary = Math.round(monthlyWage * 0.5);

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
 * Recalculates all components reactively given a wage and list of custom components
 */
export function recalculateComponents(monthlyWage, components) {
  let basicSalary = 0;
  
  // First pass: Calculate percentage components based on Wage and find Basic
  const updated = components.map((comp) => {
    if (comp.name === 'Basic Salary' || comp.id === 'comp-basic') {
      const amt = comp.calculationType === 'percentage'
        ? Math.round((monthlyWage * comp.value) / 100)
        : comp.value;
      basicSalary = amt;
      return { ...comp, calculatedAmount: amt };
    }
    return comp;
  });

  // Second pass: Calculate HRA or other Basic-dependent components and fixed components (excluding balancing)
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
        amt = Math.round((basicSalary * comp.value) / 100);
      } else {
        amt = Math.round((monthlyWage * comp.value) / 100);
      }
      nonBalancingTotal += amt;
      return { ...comp, calculatedAmount: amt };
    } else {
      nonBalancingTotal += Number(comp.value) || 0;
      return { ...comp, calculatedAmount: Number(comp.value) || 0 };
    }
  });

  // Third pass: Balance the Fixed Allowance
  const balancingAmount = monthlyWage - nonBalancingTotal;
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
  const employeePF = Math.round((basicSalary * employeePFPercentage) / 100);
  const employerPF = Math.round((basicSalary * employerPFPercentage) / 100);
  const totalDeductions = employeePF + professionalTax;

  return {
    employeePF,
    employerPF,
    professionalTax,
    totalDeductions,
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
  const payableDays = Math.max(0, totalWorkingDays - unpaidLeaveDays - unapprovedAbsentDays);
  const basicSalaryComp = salary?.components?.find((c) => c.name === 'Basic Salary') || salary?.components?.[0];
  const basicSalary = basicSalaryComp ? basicSalaryComp.calculatedAmount : Math.round(salary?.monthlyWage * 0.5);

  const deductions = calculateDeductions(
    basicSalary,
    salary?.employeePFPercentage || 12,
    salary?.employerPFPercentage || 12,
    salary?.professionalTax || 200
  );

  // Proportionate monthly earned wage based on payable days
  const perDayWage = totalWorkingDays > 0 ? (salary?.monthlyWage || 0) / totalWorkingDays : 0;
  const grossEarnedWage = Math.round(perDayWage * payableDays);
  const netPayable = Math.max(0, grossEarnedWage - deductions.totalDeductions);

  return {
    totalWorkingDays,
    unpaidLeaveDays,
    unapprovedAbsentDays,
    payableDays,
    grossMonthlyWage: salary?.monthlyWage || 0,
    grossEarnedWage,
    deductions,
    netPayable,
  };
}
