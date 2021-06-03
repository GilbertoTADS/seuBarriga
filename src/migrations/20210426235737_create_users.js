exports.up = async (knex) => {
  const table = await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('name').notNull();
    t.string('mail').notNull().unique();
    t.string('passwd').notNull();
  });
  return table;
};

exports.down = async (knex) => {
  const table = await knex.schema.dropTable('users');
  return table;
};
