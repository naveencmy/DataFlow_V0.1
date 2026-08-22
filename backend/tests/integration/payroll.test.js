import request from 'supertest';
import app from '../../src/app.js';
import { authService } from '../../src/modules/auth/auth.service.js';

describe('Payroll Module Integration Tests', () => {
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

  it('POST /api/v1/payroll/process by regular employee should return 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/v1/payroll/process')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        month: 'August 2026',
        year: 2026,
        monthIndex: 7,
      });
    expect(res.statusCode).toBe(403);
  });
});
