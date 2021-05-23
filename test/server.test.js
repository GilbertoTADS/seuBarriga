const supertest = require('supertest');

const request = supertest('http://localhost:3006');

test('Deve responder na porta 3006', async () => {
  const res = await request.get('/');
  expect(res.status).toBe(200);
});
