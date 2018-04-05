const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Trip } = require('./trip');

const Itinerary = sequelize.define('itinerary', {
  itinerary_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING, allowNull: false },
  start_date: { type: Sequelize.DATE, allowNull: false },
  end_date: { type: Sequelize.DATE, allowNull: false },
  itineraryAttributes: { field: 'attributes', type: Sequelize.JSON, allowNull: true },
  status: { type: Sequelize.STRING },
  created: { type: Sequelize.TIME },
  created_by: { type: Sequelize.INTEGER },
},
{
  timestamps: false,
});

Itinerary.prototype.isUserAuthorizedToView = async function(user) {
  if (user.role === 'admin') {
    return true;
  }

  try {
    let trip = await sequelize.models.trip.findById(this.trip_id);
    if (trip.attendees.includes(user._id)) {
      return true;
    }
  } catch (error) {
    console.log(error); 
  }
  
}

module.exports = { Itinerary };