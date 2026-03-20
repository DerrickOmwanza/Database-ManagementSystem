const request = require('supertest');

const app = require('../../server');

describe('Backend foundation', () => {
  test('GET /health returns healthy status', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(typeof response.body.timestamp).toBe('string');
  });

  test('GET / redirects unauthenticated users to login', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/auth/login');
  });
});
