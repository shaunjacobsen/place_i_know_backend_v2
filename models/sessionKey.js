const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');

const SessionKey = sequelize.define('session_keys', {
  session_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  token: { type: Sequelize.STRING },
  user_id: { type: Sequelize.INTEGER },
  created_at: { type: Sequelize.TIME },
  valid: { type: Sequelize.BOOLEAN },
  expires: { type: Sequelize.TIME },
},
{
  timestamps: false,
});

module.exports = { SessionKey };