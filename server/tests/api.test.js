const request = require('supertest');
const app = require('../src/app');
const authService = require('../src/services/authService');
const complaintService = require('../src/services/complaintService');
const adminComplaintService = require('../src/services/adminComplaintService');
const assignmentService = require('../src/services/assignmentService');
const departmentService = require('../src/services/departmentService');
const dashboardService = require('../src/services/dashboardService');
const { generateToken } = require('../src/services/authService');

describe('1. Health Check Endpoint', () => {
  it('GET /api/health returns 200 OK and health metadata', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toContain('College Complaint Management System');
  });
});

describe('2. Request Validation Rules', () => {
  it('POST /api/auth/register rejects missing required fields', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.some((e) => e.field === 'email')).toBe(true);
    expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
  });

  it('POST /api/auth/register rejects invalid email format', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Student',
      email: 'not-an-email',
      password: 'password123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'email')).toBe(true);
  });

  it('POST /api/auth/login rejects empty credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('3. Route Protection & Role-Based Access Control (RBAC)', () => {
  it('GET /api/auth/me returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/complaints/my returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/complaints/my');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/admin/complaints returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/admin/complaints');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/dashboard/admin returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/dashboard/admin');
    expect(res.statusCode).toBe(401);
  });
});

describe('4. Token Generation & JWT Auth Utility', () => {
  it('generates a valid signed JWT string', () => {
    const testId = '64f8a1234567890abcdef123';
    const token = generateToken(testId);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });
});

describe('5. 404 Handler', () => {
  it('returns 404 for unknown endpoints', async () => {
    const res = await request(app).get('/api/unknown-route-test');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
