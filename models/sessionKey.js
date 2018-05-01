const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { User } = require('./user');

const SessionKey = sequelize.define('session_keys', {
  session_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  token: { type: Sequelize.STRING },
  created_at: { type: Sequelize.TIME },
  valid: { type: Sequelize.BOOLEAN },
  expires: { type: Sequelize.TIME },
},
{
  timestamps: false,
});

SessionKey.getDetails = function(token) {
  return this.findOne({ where: { token } })
    .then(result => {
      console.log('result', result);
      if (!!result) {
        return Promise.resolve(result);
      }
      return Promise.reject();
    })
    .catch(() => {
      return Promise.reject();
    });
};

SessionKey.invalidate = function(token) {
  SessionKey.destroy({ where: { token: token } })
    .then(() => {
      return Promise.resolve();
    })
    .catch(e => {
      return Promise.reject(e);
    });
};

module.exports = { SessionKey };