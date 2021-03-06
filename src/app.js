const app = require('express')();
const consign = require('consign');
const knex = require('knex');

// TODO criar chaveamento dinamico

const knexfile = require('../knexfile');

app.db = knex(knexfile[process.env.NODE_ENV]);

app.get('/', (req, res) => {
  res.status(200).end();
});

consign({ cwd: 'src', verbose: false })
  .include('config/passport.js')
  .then('config/middlewares.js')
  .then('services')
  .then('routes')
  .then('config/router.js')
  .into(app);

app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  if (name === 'ValidationError') res.status(400).json({ error: message });
  if (name === 'RecursoIndevidoError') res.status(403).json({ error: message });
  else res.status(500).json({ name, message, stack });
  next(err);
});

module.exports = app;
