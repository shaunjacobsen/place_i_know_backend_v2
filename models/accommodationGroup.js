const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Accommodation } = require('./accommodation');
const { Trip } = require('./trip');

const AccommodationGroup = sequelize.define(
  'accommodation_group',
  {
    accommodation_group_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trip_id: { type: Sequelize.INTEGER },
    title: { type: Sequelize.STRING },
    status: { type: Sequelize.STRING },
    created: { type: Sequelize.TIME },
    created_by: { type: Sequelize.INTEGER },
  },
  {
    timestamps: false,
  }
);

AccommodationGroup.hasMany(Accommodation, { foreignKey: 'accommodation_group_id' });

module.exports = { AccommodationGroup };
