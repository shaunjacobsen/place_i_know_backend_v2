const Sequelize = require('sequelize');

const { sequelize } = require('./../db/pg');
const { FlightLeg } = require('./flightLeg');

const Flight = sequelize.define(
  'flight',
  {
    flight_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trip_id: { type: Sequelize.INTEGER },
    flight_group_id: { type: Sequelize.INTEGER },
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

Flight.hasMany(FlightLeg, { foreignKey: 'flight_id' });

Flight.prototype.markAsSelected = async function() {
  try {
    const group = await sequelize.models.flight_group.findOne({
      where: { flight_group_id: this.flight_group_id },
    });
    if (group.status === 'confirmed') {
      throw Error('FLIGHT_GROUP_CONFIRMED');
    }
    await Flight.update(
      {
        status: 'proposed',
      },
      {
        where: { flight_group_id: group.flight_group_id },
      }
    );
    await Flight.update(
      {
        status: 'selected',
      },
      {
        where: { flight_id: this.flight_id },
      }
    );
    return await sequelize.models.flight_group.findAll({
      where: { trip_id: this.trip_id },
      include: [{ model: Flight, attributes: ['flight_id', 'status'] }],
    });
  } catch (e) {
    return { error: e.message };
  }
};

module.exports = { Flight };
