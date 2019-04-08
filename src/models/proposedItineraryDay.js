module.exports = (sequelize, DataTypes) => {
  const ProposedItineraryDay = sequelize.define(
    'proposed_itinerary_day',
    {
      proposed_itinerary_day_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      proposed_itinerary_id: { type: DataTypes.INTEGER },
      date: { type: DataTypes.DATE, allowNull: false },
      title: { type: DataTypes.STRING },
      notes: { type: DataTypes.STRING },
    },
    {
      timestamps: false,
      tableName: 'proposed_itinerary_day',
    }
  );

  return ProposedItineraryDay;
};
