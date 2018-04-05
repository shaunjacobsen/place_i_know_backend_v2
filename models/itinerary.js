const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Trip } = require('./trip');
const { Event } = require('./event');

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

Itinerary.hasMany(Event, { foreignKey: 'itinerary_id' });

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

Itinerary.prototype.getEvents = async function() {
  try {
    return await sequelize.models.event.findAll({
      where: {
        itinerary_id: this.itinerary_id,
      }
    });
  } catch (error) {
    return error;
  }
}

Itinerary.afterValidate(async (itinerary, options) => {
  let errors = [];
  let associatedTrip = await sequelize.models.trip.findById(itinerary.trip_id);
  if (associatedTrip.start_date > itinerary.start_date) {
    errors.push({
      offender: 'start_date',
      message: 'Itinerary start date must be on or after the trip start date',
    });
  }
  if (itinerary.end_date > associatedTrip.end_date) {
    errors.push({
      offender: 'end_date',
      message: 'Itinerary end date must be on or before the trip end date',
    });
  }
  if (itinerary.end_date < itinerary.start_date) {
    errors.push({
      offender: 'end_date',
      message: 'Itinerary end date must be after the start date',
    });
  }

  if (errors.length > 0) {
    return Promise.reject(errors);
  }

  return Promise.resolve();
  
});

module.exports = { Itinerary };