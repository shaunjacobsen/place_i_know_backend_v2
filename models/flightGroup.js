const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Flight } = require('./flight');
const { Trip } = require('./trip');

const FlightGroup = sequelize.define(
  'flight_group',
  {
    flight_group_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trip_id: { type: Sequelize.INTEGER },
    title: { type: Sequelize.STRING },
    confirmed: { type: Sequelize.BOOLEAN, default: false },
    created: { type: Sequelize.TIME },
    created_by: { type: Sequelize.INTEGER },
  },
  {
    timestamps: false,
  }
);

FlightGroup.hasMany(Flight, { foreignKey: 'flight_group_id' });

module.exports = { FlightGroup };
