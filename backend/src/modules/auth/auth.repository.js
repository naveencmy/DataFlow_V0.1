import { pgPool } from '../../config/db.js';

export class AuthRepository {
  async findByEmailOrLoginId(identifier) {
    const query = `
      SELECT u.*, e.id as "employeeRecordId", e.name as "employeeName"
      FROM "User" u
      LEFT JOIN "Employee" e ON e."userId" = u."id"
      WHERE u."email" = $1 OR u."loginId" = $1
      LIMIT 1
    `;
    const result = await pgPool.query(query, [identifier]);
    return result.rows[0] || null;
  }

  async findById(id) {
    const query = `
      SELECT u.*, e.id as "employeeRecordId", e.name as "employeeName"
      FROM "User" u
      LEFT JOIN "Employee" e ON e."userId" = u."id"
      WHERE u."id" = $1
      LIMIT 1
    `;
    const result = await pgPool.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByEmail(email) {
    const query = `
      SELECT * FROM "User"
      WHERE "email" = $1
      LIMIT 1
    `;
    const result = await pgPool.query(query, [email]);
    return result.rows[0] || null;
  }

  async createUserWithEmployee({ user, employee }) {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');

      const userInsert = `
        INSERT INTO "User" ("id", "email", "loginId", "passwordHash", "role", "isEmailVerified")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const userRes = await client.query(userInsert, [
        user.id,
        user.email,
        user.loginId,
        user.passwordHash,
        user.role,
        user.isEmailVerified || false,
      ]);

      const employeeInsert = `
        INSERT INTO "Employee" (
          "id", "userId", "loginId", "name", "email", "department", "jobPosition",
          "company", "dateOfJoining", "salary", "skills", "certifications", "documents", "bankDetails"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;
      const empRes = await client.query(employeeInsert, [
        employee.id,
        user.id,
        user.loginId,
        employee.name,
        user.email,
        employee.department,
        employee.jobPosition,
        employee.company,
        employee.dateOfJoining,
        JSON.stringify(employee.salary || {}),
        JSON.stringify(employee.skills || []),
        JSON.stringify(employee.certifications || []),
        JSON.stringify(employee.documents || []),
        JSON.stringify(employee.bankDetails || {}),
      ]);

      await client.query('COMMIT');
      return { user: userRes.rows[0], employee: empRes.rows[0] };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateRefreshToken(userId, refreshToken) {
    const query = `
      UPDATE "User"
      SET "refreshToken" = $1, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = $2
      RETURNING *
    `;
    const res = await pgPool.query(query, [refreshToken, userId]);
    return res.rows[0] || null;
  }

  async markEmailVerified(email) {
    const query = `
      UPDATE "User"
      SET "isEmailVerified" = true, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "email" = $1
      RETURNING *
    `;
    const res = await pgPool.query(query, [email]);
    return res.rows[0] || null;
  }

  async updatePassword(email, passwordHash) {
    const query = `
      UPDATE "User"
      SET "passwordHash" = $1, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "email" = $2
      RETURNING *
    `;
    const res = await pgPool.query(query, [passwordHash, email]);
    return res.rows[0] || null;
  }

  async countEmployees() {
    const res = await pgPool.query('SELECT COUNT(*) FROM "Employee"');
    return parseInt(res.rows[0].count, 10) || 0;
  }
}

export const authRepository = new AuthRepository();
export default authRepository;
