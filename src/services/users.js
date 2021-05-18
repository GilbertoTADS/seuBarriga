const bCrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = async () => {
    const result = await app.db('users').select(['id', 'name', 'mail']);
    return result;
  };
  const find = async (filter = {}) => {
    const userDb = await app.db('users').select().where(filter).first();
    return userDb;
  };
  const getPasswdHash = (passwd) => {
    const salt = bCrypt.genSaltSync(10);
    return bCrypt.hashSync(passwd, salt);
  };
  const save = async (user) => {
    if (!user.name) throw new ValidationError('Nome é um atributo obrigatório');
    if (!user.mail) throw new ValidationError('Email é um atributo obrigatório');
    if (!user.passwd) throw new ValidationError('Senha é um atributo obrigatório');

    const userDb = await find({ mail: user.mail });
    if (userDb) throw new ValidationError('Já existe um usuário com este email');
    const newUser = { ...user };
    newUser.passwd = getPasswdHash(user.passwd);
    const result = await app.db('users').insert(newUser, ['id', 'name', 'mail']);
    return result;
  };
  return { findAll, find, save };
};
