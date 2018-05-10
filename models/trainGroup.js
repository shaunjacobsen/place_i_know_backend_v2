module.exports = (sequelize, DataTypes) => {
  const TrainGroup = sequelize.define(
    'train_group',
    {
      train_group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      trip_id: { type: DataTypes.INTEGER },
      title: { type: DataTypes.STRING },
      confirmed: { type: DataTypes.BOOLEAN, default: false },
      sort_index: { type: DataTypes.INTEGER },
      created: { type: DataTypes.TIME },
      created_by: { type: DataTypes.INTEGER },
    },
    {
      timestamps: false,
    }
  );

  TrainGroup.hasMany(sequelize.models.train, { foreignKey: 'train_group_id' });

  return TrainGroup;
};
