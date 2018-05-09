const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { Train } = require('./train');
const { Trip } = require('./trip');

const TrainGroup = sequelize.define(
  'train_group',
  {
    train_group_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trip_id: { type: Sequelize.INTEGER },
    title: { type: Sequelize.STRING },
    confirmed: { type: Sequelize.BOOLEAN, default: false },
    sort_index: { type: Sequelize.INTEGER },
    created: { type: Sequelize.TIME },
    created_by: { type: Sequelize.INTEGER },
  },
  {
    timestamps: false,
  }
);

TrainGroup.hasMany(Train, { foreignKey: 'train_group_id' });

module.exports = { TrainGroup };
