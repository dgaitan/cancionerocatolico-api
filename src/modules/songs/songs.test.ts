import request from 'supertest';
import { createTestApp } from '../../../tests/helpers/testApp';

jest.mock('./songs.service', () => ({
  findAll: jest.fn().mockResolvedValue({ data: [], total: 0 }),
  findById: jest.fn().mockResolvedValue(null),
}));

const app = createTestApp();

describe('GET /songs', () => {
  it('returns 401 without an auth token', async () => {
    const res = await request(app).get('/songs');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // TODO: Add authenticated tests once the DB schema is introspected.
  // Use a valid JWT signed with JWT_SECRET to test protected routes:
  //
  // it('returns 200 with a valid JWT', async () => {
  //   const token = await signJwt({ userId: '1', email: 'test@example.com' });
  //   const res = await request(app)
  //     .get('/songs')
  //     .set('Authorization', `Bearer ${token}`);
  //   expect(res.status).toBe(200);
  // });
});

describe('GET /songs/:id', () => {
  it('returns 401 without an auth token', async () => {
    const res = await request(app).get('/songs/123');
    expect(res.status).toBe(401);
  });
});
