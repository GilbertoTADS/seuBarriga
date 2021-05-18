const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/users';

const mail = `${Date.now()}@mail.com`;
let user;
beforeAll(async () => {
  const res = await app.services.users.save({ name: 'userTest', mail: `${Date.now()}@mail.com`, passwd: '123456' });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Segredo');
});

test('Deve listar todos os usuários', async () => {
  const res = await request(app).get(MAIN_ROUTE).set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body.length).toBeGreaterThan(0);
});

test('Deve inserir um usuário com sucesso', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Walter Mitty', mail, passwd: '123456' }).set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(201);
  expect(res.body.name).toBe('Walter Mitty');
  expect(res.body).not.toHaveProperty('passwd');
});

test('Não deve inserir usuário sem nome', async () => {
  const res = await request(app).post(MAIN_ROUTE).send({ mail, passwd: '123456' }).set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Nome é um atributo obrigatório');
});

test('Não deve inserir usuário sem email', async () => {
  const res = await request(app).post(MAIN_ROUTE).send({ name: 'Walter Mitty', passwd: '123456' }).set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Email é um atributo obrigatório');
});

test('Não deve inserir usuário sem senha', async () => {
  const res = await request(app).post(MAIN_ROUTE).send({ name: 'Walter Mitty', mail }).set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Senha é um atributo obrigatório');
});

test('Não deve inserir usuário com email já existente', async () => {
  const res = await request(app).post(MAIN_ROUTE).send({ name: 'Walter Mitty', mail, passwd: '123456' }).set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Já existe um usuário com este email');
});
test('Deve armazenar senha criptografada', async () => {
  const res = await request(app).post(MAIN_ROUTE).send({ name: 'Gilberto', mail: `${Date.now()}@mail.com`, passwd: 'senhaCriptografada' }).set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(201);
  const { id } = res.body;
  const userDb = await app.services.users.find({ id });
  expect(userDb.passwd).not.toBeUndefined();
  expect(userDb.passwd).not.toBe('senhaCriptografada');
});
