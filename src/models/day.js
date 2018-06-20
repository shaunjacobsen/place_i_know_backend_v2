module.exports = (sequelize, DataTypes) => {
  const Day = sequelize.define(
    'day',
    {
      day_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      itinerary_id: { type: DataTypes.INTEGER },
      event_id: { type: DataTypes.INTEGER },
      sort_index: { type: DataTypes.INTEGER },
      day_attributes: { field: 'attributes', type: DataTypes.JSON },
      date: { type: DataTypes.DATE },
      type: { type: DataTypes.STRING },
    },
    {
      timestamps: false,
    }
  );

  Day.associate = function(models) {
    Day.belongsTo(models.event, { foreignKey: 'event_id' });
  };

  return Day;
};
