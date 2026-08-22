import { pgPool } from '../../config/db.js';

export class PayrollRepository {
  async findById(id) {
    const query = `
      SELECT p.*, e.name as "employeeName", e.department, e."bankDetails", e.company, e."jobPosition"
      FROM "PayrollRun" p
      JOIN "Employee" e ON e.id = p."employeeId"
      WHERE p.id = $1
      LIMIT 1
    `;
    const res = await pgPool.query(query, [id]);
    return res.rows[0] || null;
  }

  async findByEmployee(employeeId) {
    const query = `
      SELECT p.*, e.name as "employeeName", e.department
      FROM "PayrollRun" p
      JOIN "Employee" e ON e.id = p."employeeId"
      WHERE p."employeeId" = $1
      ORDER BY p.year DESC, p."monthIndex" DESC
    `;
    const res = await pgPool.query(query, [employeeId]);
    return res.rows;
  }

  async findAll({ year, month, employeeId } = {}) {
    const conditions = [];
    const params = [];

    if (year) {
      params.push(year);
      conditions.push(`p.year = $${params.length}`);
    }

    if (month) {
      params.push(month);
      conditions.push(`p.month = $${params.length}`);
    }

    if (employeeId) {
      params.push(employeeId);
      conditions.push(`p."employeeId" = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT p.*, e.name as "employeeName", e.department, e."jobPosition"
      FROM "PayrollRun" p
      JOIN "Employee" e ON e.id = p."employeeId"
      ${whereClause}
      ORDER BY p.year DESC, p."monthIndex" DESC, e.name ASC
    `;
    const res = await pgPool.query(query, params);
    return res.rows;
  }

  async upsertPayrollRun(run) {
    const query = `
      INSERT INTO "PayrollRun" (
        "id", "employeeId", "month", "year", "monthIndex",
        "totalWorkingDays", "paidDays", "unpaidDays", "payableDays",
        "grossMonthlyWage", "basicSalary", "hra", "standardAllowance",
        "performanceBonus", "lta", "fixedAllowance",
        "employeePFDeduction", "employerPFContribution", "professionalTax",
        "totalDeductions", "netPayableAmount", "status", "processedDate"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      ON CONFLICT ("employeeId", "month", "year")
      DO UPDATE SET
        "monthIndex" = EXCLUDED."monthIndex",
        "totalWorkingDays" = EXCLUDED."totalWorkingDays",
        "paidDays" = EXCLUDED."paidDays",
        "unpaidDays" = EXCLUDED."unpaidDays",
        "payableDays" = EXCLUDED."payableDays",
        "grossMonthlyWage" = EXCLUDED."grossMonthlyWage",
        "basicSalary" = EXCLUDED."basicSalary",
        "hra" = EXCLUDED."hra",
        "standardAllowance" = EXCLUDED."standardAllowance",
        "performanceBonus" = EXCLUDED."performanceBonus",
        "lta" = EXCLUDED."lta",
        "fixedAllowance" = EXCLUDED."fixedAllowance",
        "employeePFDeduction" = EXCLUDED."employeePFDeduction",
        "employerPFContribution" = EXCLUDED."employerPFContribution",
        "professionalTax" = EXCLUDED."professionalTax",
        "totalDeductions" = EXCLUDED."totalDeductions",
        "netPayableAmount" = EXCLUDED."netPayableAmount",
        "status" = EXCLUDED."status",
        "processedDate" = EXCLUDED."processedDate",
        "updatedAt" = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      run.id,
      run.employeeId,
      run.month,
      run.year,
      run.monthIndex,
      run.totalWorkingDays,
      run.paidDays,
      run.unpaidDays,
      run.payableDays,
      run.grossMonthlyWage,
      run.basicSalary,
      run.hra,
      run.standardAllowance,
      run.performanceBonus,
      run.lta,
      run.fixedAllowance,
      run.employeePFDeduction,
      run.employerPFContribution,
      run.professionalTax,
      run.totalDeductions,
      run.netPayableAmount,
      run.status || 'Paid',
      run.processedDate || new Date().toISOString().split('T')[0],
    ];

    const res = await pgPool.query(query, values);
    return res.rows[0];
  }
}

export const payrollRepository = new PayrollRepository();
export default payrollRepository;
