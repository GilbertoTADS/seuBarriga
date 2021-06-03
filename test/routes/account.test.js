const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/accounts';
let user;
let user2;

beforeEach(async () => {
  const res = await app.services.users.save({ name: 'userTest', mail: `${Date.now()}@mail.com`, passwd: '123456' });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Segredo');

  const res2 = await app.services.users.save({ name: 'userTest2', mail: `${Date.now()}@mail.com`, passwd: '123456' });
  user2 = { ...res2[0] };
  user2.token = jwt.encode(user2, 'Segredo');
});

test('Deve inserir uma conta com sucesso', async () => {
  const result = await request(app).post(MAIN_ROUTE).send({ name: '#Acc 1' })
    .set('authorization', `bearer ${user.token}`);
  expect(result.status).toBe(201);
  expect(result.body.name).toBe('#Acc 1');
});
test('Não deve inserir uma conta sem nome', async () => {
  const result = await request(app).post(MAIN_ROUTE).send({ })
    .set('authorization', `bearer ${user.token}`);
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Nome é um atributo obrigatório');
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
test('Não deve inserir uma conta de nome duplicado para o mesmo usuário', async () => {
  await app.db('accounts').insert({ name: 'Acc duplicada', userId: user.id });
  const res = await request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Acc duplicada' });
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Já existe uma conta com este nome');
});
test('Deve listar apenas as contas do usuário', async () => {
  await app.db('accounts').insert([
    { name: 'Acc User #1', userId: user.id },
    { name: 'Acc User 2', userId: user2.id },
  ]);
  const res = await request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].name).toBe('Acc User #1');
});
test('Não deve retornar uma conta de outro usuário', async () => {
  const accDb = await app.db('accounts')
    .insert({ name: 'acc user #2', userId: user2.id }, ['id']);
  const res = await request(app).get(`${MAIN_ROUTE}/${accDb[0].id}`)
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(403);
  expect(res.body.error).toBe('Este recurso não pertence ao usuário');
});
test('Não deve alterar uma conta de outro usuário', async () => {
  const accDb = await app.db('accounts')
    .insert({ name: 'acc user #2', userId: user2.id }, ['id']);
  const res = await request(app).put(`${MAIN_ROUTE}/${accDb[0].id}`)
    .send({ name: 'Acc updated' })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(403);
  expect(res.body.error).toBe('Este recurso não pertence ao usuário');
});
test('Não deve remover uma conta de outro usuário', async () => {
  const accDb = await app.db('accounts')
    .insert({ name: 'acc user #2', userId: user2.id }, ['id']);
  const res = await request(app).delete(`${MAIN_ROUTE}/${accDb[0].id}`)
    .send({ name: 'Acc delete' })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(403);
  expect(res.body.error).toBe('Este recurso não pertence ao usuário');
});
