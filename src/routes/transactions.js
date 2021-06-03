const express = require('express');
const RecursoIndevidoError = require('../errors/RecursoIndevidoError.js');

module.exports = (app) => {
  const router = express.Router();

  router.param('id', async (req, res, next) => {
    try {
      const transacDb = await app.services.transactions.find(req.user.id, { 'transactions.id': req.params.id });
      if (transacDb.length > 0) next();
      else throw new RecursoIndevidoError();
    } catch (err) {
      next(err);
    }
  });
  router.get('/', async (req, res, next) => {
    try {
      const user = await app.services.transactions.find(req.user.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  });
  router.post('/', async (req, res, next) => {
    try {
      const user = await app.services.transactions.save(req.body);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  });
  router.get('/:id', async (req, res, next) => {
    try {
      const transaction = await app.services.transactions.findOne({ id: req.params.id });
      res.status(200).json(transaction);
    } catch (err) {
      next(err);
    }
  });
  router.put('/:id', async (req, res, next) => {
    try {
      const result = await app.services.transactions.update(req.params.id, req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  });
  router.delete('/:id', async (req, res, next) => {
    try {
      const result = await app.services.transactions.remove(req.params.id);
      res.status(204).json(result);
    } catch (err) {
      next(err);
    }
  });
  return router;
};
