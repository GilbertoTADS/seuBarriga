exports.up = async (knex) => {
  const table = await knex.schema.createTable('transactions', async (t) => {
    t.increments('id').primary();
    t.string('description').notNull();
    t.enu('type', ['I', 'O']).notNull();
    t.date('date').notNull();
    t.decimal('amount', 15, 2).notNull();
    t.boolean('status').notNull().default(false);
    t.integer('acc_id')
      .references('id')
      .inTable('accounts')
      .notNull();
  });
  return table;
};

exports.down = async (knex) => {
  await knex.schema.dropTable('transactions');
};
