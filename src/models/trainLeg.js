module.exports = (sequelize, DataTypes) => {
  const TrainLeg = sequelize.define(
    'train_leg',
    {
      train_leg_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      train_id: { type: DataTypes.INTEGER },
      operator_id: { type: DataTypes.INTEGER },
      company: { type: DataTypes.STRING },
      train_type: { type: DataTypes.STRING },
      train_number: { type: DataTypes.STRING },
      departure_time: { type: DataTypes.TIME },
      arrival_time: { type: DataTypes.TIME },
      duration: { type: DataTypes.INTEGER },
      departure_station: { type: DataTypes.STRING },
      arrival_station: { type: DataTypes.STRING },
      departure_place_id: { type: DataTypes.INTEGER },
      arrival_place_id: { type: DataTypes.INTEGER },
      class: { type: DataTypes.STRING },
      wifi: { type: DataTypes.STRING },
      booking_reference: { type: DataTypes.STRING },
      notes: { type: DataTypes.STRING },
      created: { type: DataTypes.TIME },
      created_by: { type: DataTypes.INTEGER },
    },
    {
      timestamps: false,
    }
  );

  TrainLeg.associate = function(models) {
    TrainLeg.belongsTo(models.operator, { foreignKey: 'operator_id' });
  }
  
  return TrainLeg;
};
