module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'admin',
      database: 'barriga',
    },
    migrations: {
      directory: 'src/migrations',
    },
  },
};
