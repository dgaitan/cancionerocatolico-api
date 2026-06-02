import request from 'supertest';
import { createTestApp } from '../../../tests/helpers/testApp';

// Defined here (not before jest.mock) — jest.mock factories are hoisted and can't reference outer vars
const MOCK_TOKENS = { accessToken: 'mock.access.token', refreshToken: 'mock.refresh.token' };

jest.mock('./auth.service', () => ({
  registerUser: jest.fn().mockResolvedValue(undefined),
  loginUser: jest.fn().mockResolvedValue(undefined),
  verifyMagicLinkToken: jest
    .fn()
    .mockResolvedValue({ accessToken: 'mock.access.token', refreshToken: 'mock.refresh.token' }),
  refreshAccessToken: jest
    .fn()
    .mockResolvedValue({ accessToken: 'mock.access.token', refreshToken: 'mock.refresh.token' }),
  revokeRefreshToken: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../lib/jwt', () => ({
  ...jest.requireActual('../../lib/jwt'),
  verifyJwt: jest.fn().mockReturnValue({ userId: '1', email: 'test@example.com' }),
}));

import { registerUser, loginUser } from './auth.service';

const app = createTestApp();

describe('POST /auth/register', () => {
  const validPayload = { name: 'Test User', email: 'test@example.com', username: 'testuser' };

  it('returns 201 for a valid registration', async () => {
    const res = await request(app).post('/auth/register').send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBeDefined();
    expect(registerUser).toHaveBeenCalledWith('Test User', 'test@example.com', 'testuser');
  });

  it('returns 409 when email already exists', async () => {
    const createError = await import('http-errors');
    (registerUser as jest.Mock).mockRejectedValueOnce(
      createError.default(409, 'An account with this email already exists. Please log in.'),
    );
    const res = await request(app).post('/auth/register').send(validPayload);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('returns 409 when username already exists', async () => {
    const createError = await import('http-errors');
    (registerUser as jest.Mock).mockRejectedValueOnce(
      createError.default(409, 'Username is already taken.'),
    );
    const res = await request(app).post('/auth/register').send(validPayload);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('returns 422 when email is invalid', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ ...validPayload, email: 'not-an-email' });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 422 when username has invalid characters', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ ...validPayload, username: 'bad username!' });
    expect(res.status).toBe(422);
  });

  it('returns 422 when required fields are missing', async () => {
    const res = await request(app).post('/auth/register').send({ email: 'test@example.com' });
    expect(res.status).toBe(422);
  });
});

describe('POST /auth/login', () => {
  it('returns 200 for an existing email', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(loginUser).toHaveBeenCalledWith('test@example.com');
  });

  it('returns 404 when email is not registered', async () => {
    const createError = await import('http-errors');
    (loginUser as jest.Mock).mockRejectedValueOnce(
      createError.default(404, 'No account found with this email. Please register.'),
    );
    const res = await request(app).post('/auth/login').send({ email: 'nobody@example.com' });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 422 for an invalid email format', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'not-an-email' });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 422 when email is missing', async () => {
    const res = await request(app).post('/auth/login').send({});
    expect(res.status).toBe(422);
  });
});

describe('POST /auth/verify', () => {
  it('returns 200 with accessToken and refreshToken for valid credentials', async () => {
    const res = await request(app)
      .post('/auth/verify')
      .send({ email: 'test@example.com', token: 'abc123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBe(MOCK_TOKENS.accessToken);
    expect(res.body.data.refreshToken).toBe(MOCK_TOKENS.refreshToken);
  });

  it('returns 401 for an expired or invalid token', async () => {
    const createError = await import('http-errors');
    const { verifyMagicLinkToken } = await import('./auth.service');
    (verifyMagicLinkToken as jest.Mock).mockRejectedValueOnce(
      createError.default(401, 'Invalid or expired token'),
    );
    const res = await request(app)
      .post('/auth/verify')
      .send({ email: 'test@example.com', token: 'abc123' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 422 when token is not 6 characters', async () => {
    const res = await request(app)
      .post('/auth/verify')
      .send({ email: 'test@example.com', token: 'short' });
    expect(res.status).toBe(422);
  });

  it('returns 422 when email is missing', async () => {
    const res = await request(app).post('/auth/verify').send({ token: 'abc123' });
    expect(res.status).toBe(422);
  });
});

describe('POST /auth/refresh', () => {
  it('returns 200 with a new token pair for a valid refresh token', async () => {
    const res = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: 'valid-refresh-token' });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBe(MOCK_TOKENS.accessToken);
    expect(res.body.data.refreshToken).toBe(MOCK_TOKENS.refreshToken);
  });

  it('returns 401 for an invalid or expired refresh token', async () => {
    const createError = await import('http-errors');
    const { refreshAccessToken } = await import('./auth.service');
    (refreshAccessToken as jest.Mock).mockRejectedValueOnce(
      createError.default(401, 'Invalid or expired refresh token'),
    );
    const res = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: 'bad-token' });
    expect(res.status).toBe(401);
  });

  it('returns 422 when refreshToken is missing', async () => {
    const res = await request(app).post('/auth/refresh').send({});
    expect(res.status).toBe(422);
  });
});

describe('POST /auth/logout', () => {
  it('returns 200 for an authenticated user', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .set('Authorization', 'Bearer valid.jwt.token');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe('Logged out successfully.');
  });

  it('returns 401 when no Bearer token is provided', async () => {
    const { verifyJwt } = await import('../../lib/jwt');
    (verifyJwt as jest.Mock).mockImplementationOnce(() => {
      throw new Error('No token');
    });
    const res = await request(app).post('/auth/logout');
    expect(res.status).toBe(401);
  });
});
