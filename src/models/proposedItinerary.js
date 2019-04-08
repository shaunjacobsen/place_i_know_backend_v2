module.exports = (sequelize, DataTypes) => {
  const ProposedItinerary = sequelize.define(
    'proposed_itinerary',
    {
      proposed_itinerary_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      trip_id: { type: DataTypes.INTEGER },
      title: { type: DataTypes.STRING },
      status: { type: DataTypes.STRING },
      start_date: { type: DataTypes.DATE, allowNull: false },
      end_date: { type: DataTypes.DATE, allowNull: false },
      created_at: { type: DataTypes.TIME },
    },
    {
      timestamps: false,
      tableName: 'proposed_itinerary',
    }
  );

  ProposedItinerary.associate = function(models) {
    ProposedItinerary.hasMany(models.proposed_itinerary_day, {
      foreignKey: 'proposed_itinerary_id',
    });
  };

  return ProposedItinerary;
};
