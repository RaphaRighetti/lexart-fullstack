const db = {
  username: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'root',
  host: process.env.MYSQLHOST || 'localhost',
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
    database: process.env.MYSQLDATABASE || 'products_db',
  },
};
