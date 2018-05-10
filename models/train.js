module.exports = (sequelize, DataTypes) => {
  const Train = sequelize.define(
    'train',
    {
      train_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      trip_id: { type: DataTypes.INTEGER },
      train_group_id: { type: DataTypes.INTEGER },
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

  Train.associate = function(models) {
    Train.hasMany(models.train_leg, { foreignKey: 'train_id' });
  };

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

  return Train;
};
