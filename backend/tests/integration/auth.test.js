import request from 'supertest';
import app from '../../src/app.js';
import { authService } from '../../src/modules/auth/auth.service.js';

describe('Auth Module Integration Tests', () => {
  it('GET /api/health should return 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.service).toBe('Dayflow HRMS REST API');
  });

  it('POST /api/v1/auth/login with missing fields should return 400 Validation Error', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/v1/auth/register with invalid email should fail validation', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Test User',
      email: 'not-an-email',
      password: 'DayflowPassword123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/refresh without token should return 401 Unauthorized', async () => {
    const res = await request(app).post('/api/v1/auth/refresh').send({});
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
