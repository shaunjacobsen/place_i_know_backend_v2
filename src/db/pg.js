const Sequelize = require('sequelize');
require('./../config/config');

let isInTestEnvironment = () => {
  return process.env.NODE_ENV === 'test';
};

let shouldUseSSL = () => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return false;
  } else {
    return true;
  }
};

const sequelize = new Sequelize(process.env.PG_DB_URI, {
  dialect: 'postgres',
  logging: !isInTestEnvironment(),
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to postgres');
  })
  .catch(() => {
    console.log('Unable to connect to postgres');
  });

module.exports = { sequelize };
