const Sequelize = require('sequelize');
require('./../config/config');

const sequelize = new Sequelize(process.env.PG_DB_URI, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true,
  },
});

sequelize.authenticate().then(() => {
  console.log('Connected to postgres');
}).catch(() => {
  console.log('Unable to connect to postgres');
});

module.exports = { sequelize };