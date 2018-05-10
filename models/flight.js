module.exports = (sequelize, DataTypes) => {
  const Flight = sequelize.define(
    'flight',
    {
      flight_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      trip_id: { type: DataTypes.INTEGER },
      flight_group_id: { type: DataTypes.INTEGER },
      status: { type: DataTypes.STRING },
      subtotal: { type: DataTypes.NUMERIC(7, 2) },
      taxes: { type: DataTypes.NUMERIC(7, 2) },
      total: { type: DataTypes.NUMERIC(7, 2) },
      charges_id: { type: DataTypes.INTEGER },
      passenger_count: { type: DataTypes.INTEGER },
      vendor: { type: DataTypes.STRING },
      booking_ref: { type: DataTypes.STRING },
      created: { type: DataTypes.TIME },
      created_by: { type: DataTypes.INTEGER },
    },
    {
      timestamps: false,
    }
  );

  Flight.associate = function(models) {
    Flight.belongsTo(models.flight_leg, { foreignKey: 'flight_id' });
  };

  Flight.prototype.markAsSelected = async function() {
    try {
      const group = await sequelize.models.flight_group.findOne({
        where: { flight_group_id: this.flight_group_id },
      });
      if (group.confirmed) {
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

  return Flight;
};
