const db = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql'
};

module.exports = {
  development: {
    ...db,
    database: process.env.DB_DEV || 'products_db',
  },
  test: {
    ...db,
    database: process.env.DB_TEST || 'products_db',
  },
  production: {
    ...db,
    database: process.env.DB_PROD || 'products_db',
  },
};
