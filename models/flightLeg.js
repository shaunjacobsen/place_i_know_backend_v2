const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Trip } = require('./trip');
const { Operator } = require('./operator');

const FlightLeg = sequelize.define(
  'flight_leg',
  {
    flight_leg_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    flight_id: { type: Sequelize.INTEGER },
    flight_no: { type: Sequelize.INTEGER },
    operator_id: { type: Sequelize.INTEGER },
    duration: { type: Sequelize.INTEGER },
    departure_time: { type: Sequelize.TIME },
    arrival_time: { type: Sequelize.TIME },
    departure_airport_code: { type: Sequelize.STRING },
    departure_airport: { type: Sequelize.STRING },
    arrival_airport_code: { type: Sequelize.STRING },
    arrival_airport: { type: Sequelize.STRING },
    departure_place_id: { type: Sequelize.INTEGER },
    arrival_place_id: { type: Sequelize.INTEGER },
    fare_code: { type: Sequelize.STRING },
    fare_class: { type: Sequelize.STRING },
    meal_type: { type: Sequelize.STRING },
    wifi_on_board: { type: Sequelize.STRING },
    first_bag_fee: { type: Sequelize.NUMERIC(7, 2) },
    second_bag_fee: { type: Sequelize.NUMERIC(7, 2) },
    notes: { type: Sequelize.STRING },
    created: { type: Sequelize.TIME },
    created_by: { type: Sequelize.INTEGER },
  },
  {
    timestamps: false,
  }
);

FlightLeg.belongsTo(Operator, { foreignKey: 'operator_id' });

module.exports = { FlightLeg };
