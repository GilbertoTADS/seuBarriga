const express = require('express');
const jwt = require('jwt-simple');
const bCrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationError');

const secret = 'Segredo';

module.exports = (app) => {
  const router = express.Router();

  router.post('/signin', async (req, res, next) => {
    try {
      const userDb = await app.services.users.find({ mail: req.body.mail });
      if (!userDb) throw new ValidationError('Usuário ou senha inválido');
      if (!bCrypt.compareSync(req.body.passwd, userDb.passwd)) throw new ValidationError('Usuário ou senha inválido');
      const payload = {
        id: userDb.id,
        name: userDb.name,
        mail: userDb.mail,
      };
      const token = jwt.encode(payload, secret);
      return res.status(200).json({ token });
    } catch (err) {
      return next(err);
    }
  });
  router.post('/signup', async (req, res, next) => {
    try {
      const result = await app.services.users.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });
  return router;
};
