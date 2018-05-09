const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Trip } = require('./trip');
const { Operator } = require('./operator');

const TrainLeg = sequelize.define(
  'train_leg',
  {
    train_leg_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    train_id: { type: Sequelize.INTEGER },
    operator_id: { type: Sequelize.INTEGER },
    company: { type: Sequelize.STRING },
    train_type: { type: Sequelize.STRING },
    train_number: { type: Sequelize.STRING },
    departure_time: { type: Sequelize.TIME },
    arrival_time: { type: Sequelize.TIME },
    duration: { type: Sequelize.INTEGER },
    departure_station: { type: Sequelize.STRING },
    arrival_station: { type: Sequelize.STRING },
    departure_place_id: { type: Sequelize.INTEGER },
    arrival_place_id: { type: Sequelize.INTEGER },
    class: { type: Sequelize.STRING },
    wifi: { type: Sequelize.STRING },
    booking_reference: { type: Sequelize.STRING },
    notes: { type: Sequelize.STRING },
    created: { type: Sequelize.TIME },
    created_by: { type: Sequelize.INTEGER },
  },
  {
    timestamps: false,
  }
);

TrainLeg.belongsTo(Operator, { foreignKey: 'operator_id' });

module.exports = { TrainLeg };
