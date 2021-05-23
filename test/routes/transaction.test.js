const request = require('supertest');
const app = require('../../src/app');

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
  const accs = await app.db('accounts').insert([
    { name: 'acc user1', userId: user.id },
    { name: 'acc user2', userId: user2.id },

  ], '*');
  [accUser, accUser2] = accs;
});

test('Deve listar apenas as transações do usuário', async () => {

});
