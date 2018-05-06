const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Itinerary } = require('./itinerary');
const { Image } = require('./image');
const { Day } = require('./day');
const { Place } = require('./place');

const Event = sequelize.define(
  'event',
  {
    event_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    itinerary_id: { type: Sequelize.INTEGER },
    event_type: { field: 'type', type: Sequelize.STRING, allowNull: false },
    subtype: { type: Sequelize.STRING, allowNull: false },
    event_attributes: { field: 'attributes', type: Sequelize.STRING },
    title: { type: Sequelize.STRING, allowNull: false },
    start_time: { type: Sequelize.TIME, allowNull: false },
    end_time: { type: Sequelize.TIME, allowNull: false },
    duration: { type: Sequelize.INTEGER },
    notes: { type: Sequelize.STRING },
    places: { type: Sequelize.ARRAY(Sequelize.INTEGER), allowNull: false },
    start_tz: { type: Sequelize.STRING },
    end_tz: { type: Sequelize.STRING },
    price: { type: Sequelize.INTEGER },
    is_prepaid: { type: Sequelize.BOOLEAN },
    currency: { type: Sequelize.STRING },
    price_is_approximate: { type: Sequelize.BOOLEAN },
    created: { type: Sequelize.TIME },
    created_by: { type: Sequelize.INTEGER },
  },
  {
    timestamps: false,
  }
);

Event.belongsTo(Image, {
  foreignKey: 'image_id',
  targetKey: 'image_id',
});

Event.hasOne(Day, { foreignKey: 'event_id' });

Event.afterValidate(async (event, options) => {
  let errors = [];
  let associatedItinerary = await sequelize.models.itinerary.findById(event.itinerary_id);
  const eventStartTime = new Date(event.start_time);
  const eventEndTime = new Date(event.end_time);
  if (associatedItinerary.start_date > eventStartTime) {
    errors.push({
      offender: 'start_time',
      message: 'Event start time must be on or after the itinerary start date',
    });
  }
  if (eventEndTime > associatedItinerary.end_date) {
    errors.push({
      offender: 'end_time',
      message: 'Event end time must be on or before the itinerary end date',
    });
  }
  if (eventEndTime < eventStartTime) {
    errors.push({
      offender: 'end_time',
      message: 'Event end time must be after the start time',
    });
  }

  if (errors.length > 0) {
    return Promise.reject(errors);
  }

  return Promise.resolve();
});

module.exports = { Event };
