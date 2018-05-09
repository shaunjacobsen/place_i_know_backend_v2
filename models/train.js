const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { TrainLeg } = require('./trainLeg');

const Train = sequelize.define(
  'train',
  {
    train_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trip_id: { type: Sequelize.INTEGER },
    train_group_id: { type: Sequelize.INTEGER },
    status: { type: Sequelize.STRING },
    subtotal: { type: Sequelize.NUMERIC(7, 2) },
    taxes: { type: Sequelize.NUMERIC(7, 2) },
    total: { type: Sequelize.NUMERIC(7, 2) },
    charges_id: { type: Sequelize.INTEGER },
    passenger_count: { type: Sequelize.INTEGER },
    vendor: { type: Sequelize.STRING },
    booking_ref: { type: Sequelize.STRING },
    created: { type: Sequelize.TIME },
    created_by: { type: Sequelize.INTEGER },
  },
  {
    timestamps: false,
  }
);

Train.hasMany(TrainLeg, { foreignKey: 'train_id' });

Train.prototype.markAsSelected = async function() {
  try {
    const group = await sequelize.models.train_group.findOne({
      where: { train_group_id: this.train_group_id },
    });
    if (group.confirmed) {
      throw Error('TRAIN_GROUP_CONFIRMED');
    }
    await Train.update(
      {
        status: 'proposed',
      },
      {
        where: { train_group_id: group.train_group_id },
      }
    );
    await Train.update(
      {
        status: 'selected',
      },
      {
        where: { train_id: this.train_id },
      }
    );
    return await sequelize.models.train_group.findAll({
      where: { trip_id: this.trip_id },
      include: [{ model: Train, attributes: ['train_id', 'status'] }],
    });
  } catch (e) {
    return { error: e.message };
  }
};

module.exports = { Train };
