const supertest = require('supertest');

const request = supertest('http://localhost:3001');

test('Deve responder na porta 3001', async () => {
  const res = await request.get('/');
  expect(res.status).toBe(200);
});
