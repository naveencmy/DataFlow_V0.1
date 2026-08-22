import { pgPool } from '../../config/db.js';

export class EmployeeRepository {
  async findAll({ page = 1, limit = 20, search = '', department = '' }) {
    const offset = (page - 1) * limit;
    const params = [];
    let whereConditions = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      whereConditions.push(
        `(LOWER(e.name) LIKE $${params.length} OR LOWER(e.email) LIKE $${params.length} OR LOWER(e."loginId") LIKE $${params.length} OR LOWER(e."jobPosition") LIKE $${params.length})`
      );
    }

    if (department) {
      params.push(department);
      whereConditions.push(`e.department = $${params.length}`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*) FROM "Employee" e
      ${whereClause}
    `;
    const countRes = await pgPool.query(countQuery, params);
    const total = parseInt(countRes.rows[0].count, 10) || 0;

    params.push(limit);
    const limitIdx = params.length;
    params.push(offset);
    const offsetIdx = params.length;

    const dataQuery = `
      SELECT e.*, u.role as "userRole"
      FROM "Employee" e
      JOIN "User" u ON u.id = e."userId"
      ${whereClause}
      ORDER BY e."createdAt" DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `;
    const dataRes = await pgPool.query(dataQuery, params);

    return {
      data: dataRes.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id) {
    const query = `
      SELECT e.*, u.role as "userRole", u.email as "accountEmail"
      FROM "Employee" e
      JOIN "User" u ON u.id = e."userId"
      WHERE e.id = $1 OR e."userId" = $1 OR e."loginId" = $1
      LIMIT 1
    `;
    const res = await pgPool.query(query, [id]);
    return res.rows[0] || null;
  }

  async findByEmail(email) {
    const query = `
      SELECT * FROM "Employee" WHERE "email" = $1 LIMIT 1
    `;
    const res = await pgPool.query(query, [email]);
    return res.rows[0] || null;
  }

  async countAll() {
    const res = await pgPool.query('SELECT COUNT(*) FROM "Employee"');
    return parseInt(res.rows[0].count, 10) || 0;
  }

  async create({ user, employee }) {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');

      const userQuery = `
        INSERT INTO "User" ("id", "email", "loginId", "passwordHash", "role", "isEmailVerified")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const userRes = await client.query(userQuery, [
        user.id,
        user.email,
        user.loginId,
        user.passwordHash,
        user.role || 'EMPLOYEE',
        user.isEmailVerified ?? true,
      ]);

      const empQuery = `
        INSERT INTO "Employee" (
          "id", "userId", "loginId", "name", "email", "mobile", "profilePicture",
          "department", "jobPosition", "manager", "location", "company",
          "dateOfJoining", "dateOfBirth", "residentialAddress", "nationality",
          "personalEmail", "gender", "maritalStatus", "about", "whatILoveAboutMyJob",
          "interestsAndHobbies", "skills", "certifications", "documents", "bankDetails", "salary"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
        RETURNING *
      `;
      const empRes = await client.query(empQuery, [
        employee.id,
        user.id,
        user.loginId,
        employee.name,
        user.email,
        employee.mobile || null,
        employee.profilePicture || null,
        employee.department,
        employee.jobPosition,
        employee.manager || null,
        employee.location || 'Bangalore Tech Hub',
        employee.company || 'Dayflow Technologies Pvt Ltd',
        employee.dateOfJoining,
        employee.dateOfBirth || null,
        employee.residentialAddress || null,
        employee.nationality || 'Indian',
        employee.personalEmail || null,
        employee.gender || null,
        employee.maritalStatus || null,
        employee.about || null,
        employee.whatILoveAboutMyJob || null,
        employee.interestsAndHobbies || null,
        JSON.stringify(employee.skills || []),
        JSON.stringify(employee.certifications || []),
        JSON.stringify(employee.documents || []),
        JSON.stringify(employee.bankDetails || {}),
        JSON.stringify(employee.salary || {}),
      ]);

      await client.query('COMMIT');
      return empRes.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async update(id, updates) {
    const allowedFields = [
      'name',
      'email',
      'mobile',
      'profilePicture',
      'department',
      'jobPosition',
      'manager',
      'location',
      'company',
      'dateOfJoining',
      'dateOfBirth',
      'residentialAddress',
      'nationality',
      'personalEmail',
      'gender',
      'maritalStatus',
      'about',
      'whatILoveAboutMyJob',
      'interestsAndHobbies',
      'skills',
      'certifications',
      'documents',
      'bankDetails',
      'salary',
    ];

    const setClauses = [];
    const values = [];

    for (const [key, val] of Object.entries(updates)) {
      if (allowedFields.includes(key) && val !== undefined) {
        values.push(
          typeof val === 'object' && val !== null ? JSON.stringify(val) : val
        );
        setClauses.push(`"${key}" = $${values.length}`);
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const idIdx = values.length;

    const query = `
      UPDATE "Employee"
      SET ${setClauses.join(', ')}, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = $${idIdx}
      RETURNING *
    `;

    const res = await pgPool.query(query, values);
    return res.rows[0] || null;
  }

  async delete(id) {
    const emp = await this.findById(id);
    if (!emp) return null;

    // Cascade delete via User
    const query = `DELETE FROM "User" WHERE "id" = $1 RETURNING *`;
    const res = await pgPool.query(query, [emp.userId]);
    return res.rows[0] || null;
  }
}

export const employeeRepository = new EmployeeRepository();
export default employeeRepository;
