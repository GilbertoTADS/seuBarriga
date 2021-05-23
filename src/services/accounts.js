const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = async (userId) => {
    const accounts = await app.db('accounts').select().where({ userId });
    return accounts;
  };
  const find = async (filter = {}) => {
    const account = await app.db('accounts').select().where(filter).first();
    return account;
  };
  const save = async (account) => {
    if (!account.name) throw new ValidationError('Nome é um atributo obrigatório');
    const accDbExists = await find({ name: account.name, userId: account.userId });
    if (accDbExists) throw new ValidationError('Já existe uma conta com este nome');
    const accountDb = await app.db('accounts').insert(account, '*');
    return accountDb;
  };
  const update = async (id, account) => {
    const accountDb = app.db('accounts').update(account, '*').where({ id });
    return accountDb;
  };
  const remove = async (id) => {
    const accountRemoved = app.db('accounts').delete().where({ id });
    return accountRemoved;
  };
  return {
    save, findAll, find, update, remove,
  };
};
