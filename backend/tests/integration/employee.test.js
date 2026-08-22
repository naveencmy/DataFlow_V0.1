import request from 'supertest';
import app from '../../src/app.js';
import { authService } from '../../src/modules/auth/auth.service.js';

describe('Employee Module Integration Tests', () => {
  const adminToken = authService.generateTokens({
    userId: 'user-admin',
    loginId: 'admin@dayflow.internal',
    email: 'admin@dayflow.internal',
    role: 'ADMIN',
  }).accessToken;

  const employeeToken = authService.generateTokens({
    userId: 'user-emp-1',
    loginId: 'OITODO0220001',
    email: 'alex.johnson@dayflow.internal',
    role: 'EMPLOYEE',
    employeeId: 'emp-1',
  }).accessToken;

  it('GET /api/v1/employees without token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/employees');
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/v1/employees with regular EMPLOYEE token should return 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/v1/employees')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        name: 'Jane Smith',
        email: 'jane.smith@dayflow.internal',
        department: 'Engineering',
        jobPosition: 'Developer',
        dateOfJoining: '2026-08-01',
      });
    expect(res.statusCode).toBe(403);
  });
});
