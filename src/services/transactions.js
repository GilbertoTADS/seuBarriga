const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const find = async (userId, filter = {}) => {
    const transaction = await app.db('transactions')
      .join('accounts', 'accounts.id', 'acc_id')
      .where(filter)
      .andWhere('accounts.userId', '=', userId)
      .select();
    return transaction;
  };
  const save = async (transaction) => {
    if (!transaction.description) throw new ValidationError('Descrição é um atributo obrigatório');
    if (!transaction.amount) throw new ValidationError('Valor é um atributo obrigatório');
    if (!transaction.date) throw new ValidationError('Data é um atributo obrigatório');
    if (!transaction.acc_id) throw new ValidationError('Conta é um atributo obrigatório');
    if (!transaction.type) throw new ValidationError('Tipo é um atributo obrigatório');
    if ((transaction.type !== 'I')
        && (transaction.type !== 'O')) throw new ValidationError('O tipo informado é inválido');

    const newTransaction = { ...transaction };
    if ((transaction.type === 'I' && transaction.amount < 0)
      || (transaction.type === 'O' && transaction.amount > 0)) newTransaction.amount *= -1;
    const transactionDb = await app.db('transactions')
      .insert(newTransaction, '*');
    return transactionDb;
  };
  const findOne = async (filter) => {
    const transactionDb = await app.db('transactions')
      .select().where(filter);
    return transactionDb;
  };
  const update = async (id, transaction) => {
    const transactionDb = await app.db('transactions')
      .update(transaction, '*').where({ id });
    return transactionDb;
  };
  const remove = async (id) => {
    const transactionDb = await app.db('transactions')
      .del().where({ id });
    return transactionDb;
  };
  return {
    find, save, findOne, update, remove,
  };
};
