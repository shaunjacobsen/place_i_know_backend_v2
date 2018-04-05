const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Itinerary } = require('./itinerary');

const Trip = sequelize.define('trip', {
  trip_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING, allowNull: false },
  start_date: { type: Sequelize.DATE, allowNull: false },
  end_date: { type: Sequelize.DATE, allowNull: false },
  created: { type: Sequelize.TIME },
  tripAttributes: { field: 'attributes', type: Sequelize.JSON, allowNull: true },
  created_by: { type: Sequelize.INTEGER },
  attendees: { type: Sequelize.ARRAY(Sequelize.INTEGER), allowNull: false }
},
{
  timestamps: false,
});

Trip.hasMany(Itinerary, { foreignKey: 'trip_id' });

Trip.findByUser = function(userId) {
  return this.findAll({
    where: {
      attendees: {
        $contains: [userId]
      }
    },
    include: [{
      model: Itinerary
    }]
  }).then((trips) => {
    if (!trips) {
      return Promise.reject();
    }
    return Promise.resolve(trips);
  }).catch((e) => {
    console.log('error', e);
  });
}

module.exports = { Trip };