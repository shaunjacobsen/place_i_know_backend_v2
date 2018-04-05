const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');

const Trip = sequelize.define('trip', {
  trip_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING },
  start_date: { type: Sequelize.DATE },
  end_date: { type: Sequelize.DATE },
  created: { type: Sequelize.TIME },
  tripAttributes: { field: 'attributes', type: Sequelize.JSON, allowNull: true },
  //created_by: { type: Sequelize.TIME },
  attendees: { type: Sequelize.ARRAY(Sequelize.INTEGER) }
},
{
  timestamps: false,
});

Trip.findByUser = function(userId) {
  return this.findAll({ where: { attendees: { $contains: [userId] } } }).then((trips) => {
    if (!trips) {
      return Promise.reject();
    }
    return Promise.resolve(trips);
  }).catch(() => {
    console.log('error');
  });
}

module.exports = { Trip };