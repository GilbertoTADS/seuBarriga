const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.post('/', async (req, res, next) => {
    try {
      const account = await app.services.accounts.save(req.body);
      return res.status(201).json(account[0]);
    } catch (err) {
      return next(err);
    }
  });
  router.get('/', async (req, res, next) => {
    try {
      const result = await app.services.accounts.findAll();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });
  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.accounts.find({ id: req.params.id });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  });
  router.put('/:id', async (req, res, next) => {
    try {
      const result = await app.services.accounts.update(req.params.id, req.body);
      res.status(200).json(result[0]);
    } catch (err) {
      next(err);
    }
  });
  router.delete('/:id', async (req, res, next) => {
    try {
      const result = await app.services.accounts.remove(req.params.id);
      res.status(204).json(result);
    } catch (err) {
      next(err);
    }
  });
  return router;
};
