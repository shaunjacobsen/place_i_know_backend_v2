const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Itinerary } = require('./itinerary');
const { Event } = require('./event');
const { Image } = require('./image');

const Day = sequelize.define(
  'day',
  {
    day_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    itinerary_id: { type: Sequelize.INTEGER },
    event_id: { type: Sequelize.INTEGER },
    sort_index: { type: Sequelize.INTEGER },
    day_attributes: { field: 'attributes', type: Sequelize.JSON },
    date: { type: Sequelize.DATE },
    type: { type: Sequelize.STRING },
  },
  {
    timestamps: false,
  }
);

module.exports = { Day };
