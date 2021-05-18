exports.up = async (knex) => {
  const table = await knex.schema.createTable('accounts', (t) => {
    t.increments('id').primary();
    t.string('name').notNull();
    t.integer('userId')
      .references('id').inTable('users').notNull();
  });
  return table;
};

exports.down = async (knex) => {
  const result = knex.schema.dropTable('accounts');
  return result;
};
