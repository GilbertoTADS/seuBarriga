const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/accounts';
let user;

beforeAll(async () => {
  const res = await app.services.users.save({ name: 'userTest', mail: `${Date.now()}@mail.com`, passwd: '123456' });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Segredo');
});

test('Deve inserir uma conta com sucesso', async () => {
  const result = await request(app).post(MAIN_ROUTE).send({ name: '#Acc 1', userId: user.id })
    .set('authorization', `bearer ${user.token}`);
  expect(result.status).toBe(201);
  expect(result.body.name).toBe('#Acc 1');
});
test('Não deve inserir uma conta sem nome', async () => {
  const result = await request(app).post(MAIN_ROUTE).send({ userId: user.id })
    .set('authorization', `bearer ${user.token}`);
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Nome é um atributo obrigatório');
});
test('Deve listar todas as contas', async () => {
  await app.db('accounts').insert({ name: 'Acc list', userId: user.id });
  const res = await request(app).get(MAIN_ROUTE).set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body.length).toBeGreaterThan(0);
});
test('Deve retornar uma conta por id', async () => {
  const accountDb = await app.db('accounts').insert({ name: 'Acc By Id', userId: user.id }, ['id']);
  const res = await request(app).get(`${MAIN_ROUTE}/${accountDb[0].id}`).set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe('Acc By Id');
  expect(res.body.userId).toBe(user.id);
});
test('Deve alterar uma conta', async () => {
  const accountDb = await app.db('accounts').insert({ name: 'Acc To Update', userId: user.id }, ['id']);
  const res = await request(app).put(`${MAIN_ROUTE}/${accountDb[0].id}`).send({ name: 'Acc Updated' })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe('Acc Updated');
});
test('Deve remover uma conta', async () => {
  const accountDb = await app.db('accounts').insert({ name: 'Acc To Delete', userId: user.id }, ['id']);
  const res = await request(app).delete(`${MAIN_ROUTE}/${accountDb[0].id}`)
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(204);
});
test.skip('Não deve inserir uma conta de nome duplicado para o mesmo usuário', async () => {});
test.skip('Deve listar apenas as contas do usuário', async () => {});
test.skip('Não deve retornar uma conta de outro usuário', async () => {});
test.skip('Não deve alterar uma conta de outro usuário', async () => {});
test.skip('Não deve remover uma conta de outro usuário', async () => {});
