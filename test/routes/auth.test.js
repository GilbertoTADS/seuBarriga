const request = require('supertest');
const app = require('../../src/app');

test('Deve criar usuário via signup', async () => {
  const mail = `${Date.now()}@mail.com`;
  const res = await request(app).post('/auth/signup').send({ name: 'Gilberto autenticado', mail, passwd: 'passwd' });
  expect(res.status).toBe(201);
  expect(res.body.name).toBe('Gilberto autenticado');
  expect(res.body).toHaveProperty('mail');
  expect(res.body).not.toHaveProperty('passwd');
});
test('Deve receber token ao logar', async () => {
  const mail = `${Date.now()}@mail.com`;
  await app.services.users.save({ name: 'Gilberto', mail, passwd: 'passwd' });
  const res = await request(app).post('/auth/signin').send({ mail, passwd: 'passwd' });
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('token');
});
test('Não deve autenticar usuário com senha errada', async () => {
  const mail = `${Date.now()}@mail.com`;
  await app.services.users.save({ name: 'Gilberto', mail, passwd: 'passwd' });
  const res = await request(app).post('/auth/signin').send({ mail, passwd: 'passwd wrong!' });
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Usuário ou senha inválido');
});
test('Não deve autenticar usuário inexistente', async () => {
  const res = await request(app).post('/auth/signin').send({ mail: 'mailNotExists', passwd: 'passwd wrong!' });
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Usuário ou senha inválido');
});
test('Não deve acessar uma rota protegida sem token', async () => {
  const res = await request(app).get('/v1/users');
  expect(res.status).toBe(401);
});
