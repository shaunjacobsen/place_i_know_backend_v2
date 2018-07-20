module.exports = (sequelize, DataTypes) => {
  const EventRating = sequelize.define(
    'event_rating',
    {
      event_rating_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      event_id: { type: DataTypes.INTEGER },
      user_id: { type: DataTypes.INTEGER },
      rating: { type: DataTypes.DOUBLE },
      comments: { type: DataTypes.TEXT },
      time_spent: { type: DataTypes.INTEGER },
      timing_accurate: { type: DataTypes.BOOLEAN },
      app_link_id: { type: DataTypes.TEXT, unique: true },
      created_date: { type: DataTypes.TIME, default: new Date() },
      updated_date: { type: DataTypes.TIME },
    },
    {
      timestamps: false,
      tableName: 'event_ratings',
    }
  );

  return EventRating;
};
