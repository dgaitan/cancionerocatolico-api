import request from 'supertest';
import { createTestApp } from '../../../tests/helpers/testApp';

jest.mock('./auth.service', () => ({
  requestMagicLink: jest.fn().mockResolvedValue(undefined),
  verifyMagicLink: jest.fn().mockResolvedValue('mock.jwt.token'),
}));

const app = createTestApp();

describe('POST /auth/request-link', () => {
  it('returns 200 for a valid email', async () => {
    const res = await request(app)
      .post('/auth/request-link')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBeDefined();
  });

  it('returns 422 for an invalid email', async () => {
    const res = await request(app)
      .post('/auth/request-link')
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 422 when email is missing', async () => {
    const res = await request(app).post('/auth/request-link').send({});
    expect(res.status).toBe(422);
  });
});

describe('GET /auth/verify', () => {
  it('returns 422 when params are missing', async () => {
    const res = await request(app).get('/auth/verify');
    expect(res.status).toBe(422);
  });

  it('returns 422 when token length is not 6', async () => {
    const res = await request(app).get('/auth/verify?email=test@example.com&token=short');
    expect(res.status).toBe(422);
  });

  it('returns 200 with a JWT for valid email + 6-char token', async () => {
    const res = await request(app).get('/auth/verify?email=test@example.com&token=abc123');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBe('mock.jwt.token');
  });
});
