module.exports = {
  development: {
    url: process.env.PG_DB_URI,
    dialect: 'postgres',
  },
  test: {
    url: process.env.PG_DB_URI,
    dialect: 'postgres',
  },
  production: {
    url: process.env.PG_DB_URI,
    dialect: 'postgres',
  },
};
