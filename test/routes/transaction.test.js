const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transactions';
let user;
let user2;
let accUser;
let accUser2;

beforeAll(async () => {
  await app.db('transactions').del();
  await app.db('accounts').del();
  await app.db('users').del();
  const users = await app.db('users').insert([
    { name: 'User #1', mail: 'user@mail.com', passwd: '$2a$10$LvAEVZBErYXWMLTLZrsnE.SyFpm7jOFhguT.RIkApnvKBbNUt1qrO' },
    { name: 'User #2', mail: 'user2@mail.com', passwd: '$2a$10$LvAEVZBErYXWMLTLZrsnE.SyFpm7jOFhguT.RIkApnvKBbNUt1qrO' },
  ], '*');
  [user, user2] = users;
  delete user.passwd;
  user.token = jwt.encode(user, 'Segredo');
  const accs = await app.db('accounts').insert([
    { name: 'acc #1', userId: user.id },
    { name: 'acc #2', userId: user2.id },

  ], '*');
  [accUser, accUser2] = accs;
});

test('Deve listar apenas as transações do usuário', async () => {
  await app.db('transactions').insert([
    {
      description: 'T1', date: new Date(), amount: 100, type: 'I', acc_id: accUser.id,
    },
    {
      description: 'T2', date: new Date(), amount: 300, type: 'O', acc_id: accUser2.id,
    },
  ]);
  const res = await request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
  expect(res.body[0].description).toBe('T1');
});
test('Deve inserir uma transação com sucesso', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({
      description: 'New T', date: new Date(), amount: 150, type: 'I', acc_id: accUser.id,
    })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body[0].acc_id).toBe(accUser.id);
  expect(res.body[0].amount).toBe('150.00');
});
test('Transações de entrada devem ser positivas', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({
      description: 'New T', date: new Date(), amount: -150, type: 'I', acc_id: accUser.id,
    })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body[0].acc_id).toBe(accUser.id);
  expect(res.body[0].amount).toBe('150.00');
});
test('Transações de saída devem ser negativas', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({
      description: 'New T', date: new Date(), amount: -150, type: 'O', acc_id: accUser.id,
    })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body[0].acc_id).toBe(accUser.id);
  expect(res.body[0].amount).toBe('-150.00');
});
describe('Ao tentar inserir uma transação inválida', () => {
  let validTransaction;
  beforeAll(() => {
    validTransaction = {
      description: 'New T', date: new Date(), amount: 150, type: 'I', acc_id: accUser.id,
    };
  });

  const testTemplate = async (newData, errorMessage) => {
    const res = await request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({ ...validTransaction, ...newData });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(errorMessage);
  };
  test('Não deve inserir uma transação sem descrição', () => testTemplate({ description: undefined }, 'Descrição é um atributo obrigatório'));
  test('Não deve inserir uma transação sem valor', () => testTemplate({ amount: undefined }, 'Valor é um atributo obrigatório'));
  test('Não deve inserir uma transação sem data', () => testTemplate({ date: undefined }, 'Data é um atributo obrigatório'));
  test('Não deve inserir uma transação sem conta', () => testTemplate({ acc_id: undefined }, 'Conta é um atributo obrigatório'));
  test('Não deve inserir uma transação sem tipo', () => testTemplate({ type: undefined }, 'Tipo é um atributo obrigatório'));
  test('Não deve inserir uma transação sem tipo inválido', () => testTemplate({ type: 'inválido' }, 'O tipo informado é inválido'));
});
test('Não deve inserir uma transação sem valor', async () => {});
test.skip('Não deve inserir uma transação sem data', async () => {});
test.skip('Não deve inserir uma transação sem conta', async () => {});
test.skip('Não deve inserir uma transação sem tipo', async () => {});
test.skip('Não deve inserir uma transação com tipo inválido', async () => {});

test('Deve retornar uma transação por id', async () => {
  const transacaoDb = await app.db('transactions')
    .insert({
      description: 'New T ID', date: new Date(), amount: 150, type: 'I', acc_id: accUser.id,
    }, ['id']);
  const res = await request(app).get(`${MAIN_ROUTE}/${transacaoDb[0].id}`)
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(200);
  expect(res.body[0].id).toBe(transacaoDb[0].id);
  expect(res.body[0].description).toBe('New T ID');
});
test('Deve alterar uma transação por id', async () => {
  const transactionDb = await app.db('transactions').insert(
    {
      description: 'to Update', date: new Date(), amount: 250, type: 'I', acc_id: accUser.id,
    }, ['id'],
  );
  const res = await request(app).put(`${MAIN_ROUTE}/${transactionDb[0].id}`)
    .send({ description: 'Updated' })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(201);
  expect(res.body[0].description).toBe('Updated');
});
test('Deve remover uma transação por id', async () => {
  const transactionDb = await app.db('transactions').insert(
    {
      description: 'to Delete', date: new Date(), amount: 250, type: 'I', acc_id: accUser.id,
    }, ['id'],
  );
  const res = await request(app).delete(`${MAIN_ROUTE}/${transactionDb[0].id}`)
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(204);
});
test('Não deve remover uma transação de outro usuário', async () => {
  const transactionDb = await app.db('transactions').insert(
    {
      description: 'to Delete', date: new Date(), amount: 250, type: 'I', acc_id: accUser2.id,
    }, ['id'],
  );
  const res = await request(app).delete(`${MAIN_ROUTE}/${transactionDb[0].id}`)
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(403);
  expect(res.body.error).toBe('Este recurso não pertence ao usuário');
});
