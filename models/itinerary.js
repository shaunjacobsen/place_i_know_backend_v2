const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Trip } = require('./trip');
const { Event } = require('./event');
const { Day } = require('./day');

const Itinerary = sequelize.define(
  'itinerary',
  {
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
  }
);

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
    return false;
  }
};

Itinerary.prototype.getItineraryEventsListForDate = async function(date) {
  try {
    return await sequelize.query(
      'SELECT day.day_id, day.itinerary_id, day.event_id, day.sort_index, day.attributes AS day_attributes, day.date, day.type, event.event_id, event.type as event_type, event.subtype as event_subtype, event.title as event_title, event.start_time as event_start_time, event.end_time as event_end_time, event.duration as event_duration, event.notes as event_notes, event.price as event_price, event.is_prepaid as event_is_prepaid, event.currency as event_currency, event.price_is_approximate as event_price_is_approximate, place.place_id, place.type as place_type, place.name as place_name, place.address1 as place_address_1, place.address2 as place_address_2, place.city as place_city, place.state as place_state, place.postal as place_postal, place.country as place_country, place.phone as place_phone, place.website as place_website, place.latitude as place_lat, place.longitude as place_lng, place.notes as place_notes, place.hours as place_hours, place_image.secure_url AS place_image_url, event_image.secure_url AS event_image_url FROM days AS day LEFT JOIN events AS event ON day.event_id = event.event_id LEFT JOIN places AS place ON event.places[1] = place.place_id LEFT JOIN images AS place_image ON place.image_id = place_image.image_id LEFT JOIN images AS event_image ON event.image_id = event_image.image_id WHERE day.itinerary_id = ? AND day.date = ? ORDER BY day.date ASC, day.sort_index ASC;',
      { replacements: [this.itinerary_id, date] }
    );
    // return await Day.findAll({
    //   where: {
    //     itinerary_id: this.itinerary_id,
    //     date: date,
    //   },

    //   order: [['date', 'ASC'], ['sort_index', 'ASC']],
    // });
  } catch (error) {
    return error;
  }
};

Itinerary.prototype.getDateRangeOfItineraryEvents = async function() {
  try {
    return await sequelize.models.day.findAll({
      attributes: ['date'],
      where: {
        itinerary_id: this.itinerary_id,
      },
      group: ['date'],
      order: [['date', 'ASC']],
    });
  } catch (error) {
    return error;
  }
};

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
