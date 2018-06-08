module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'event',
    {
      event_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      itinerary_id: { type: DataTypes.INTEGER },
      event_type: { field: 'type', type: DataTypes.STRING, allowNull: false },
      subtype: { type: DataTypes.STRING, allowNull: false },
      event_attributes: { field: 'attributes', type: DataTypes.STRING },
      title: { type: DataTypes.STRING, allowNull: false },
      start_time: { type: DataTypes.TIME, allowNull: false },
      end_time: { type: DataTypes.TIME, allowNull: false },
      duration: { type: DataTypes.INTEGER },
      notes: { type: DataTypes.STRING },
      places: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
      place_id: { type: DataTypes.INTEGER },
      start_tz: { type: DataTypes.STRING },
      end_tz: { type: DataTypes.STRING },
      price: { type: DataTypes.INTEGER },
      is_prepaid: { type: DataTypes.BOOLEAN },
      currency: { type: DataTypes.STRING },
      price_is_approximate: { type: DataTypes.BOOLEAN },
      created: { type: DataTypes.TIME },
      created_by: { type: DataTypes.INTEGER },
    },
    {
      timestamps: false,
    }
  );

  Event.associate = function(models) {
    Event.belongsTo(models.image, {
      foreignKey: 'image_id',
      targetKey: 'image_id',
    });
    Event.hasOne(models.day, { foreignKey: 'event_id' });
    Event.belongsTo(models.place, { targetKey: 'place_id', foreignKey: 'place_id' });
  };

  Event.afterValidate(async (event, options) => {
    let errors = [];
    let associatedItinerary = await sequelize.models.itinerary.findById(
      event.itinerary_id
    );
    const eventStartTime = new Date(event.start_time);
    const eventEndTime = new Date(event.end_time);
    if (associatedItinerary.start_date > eventStartTime) {
      errors.push({
        offender: 'start_time',
        message: 'Event start time must be on or after the itinerary start date',
      });
    }
    if (eventEndTime > associatedItinerary.end_date) {
      errors.push({
        offender: 'end_time',
        message: 'Event end time must be on or before the itinerary end date',
      });
    }
    if (eventEndTime < eventStartTime) {
      errors.push({
        offender: 'end_time',
        message: 'Event end time must be after the start time',
      });
    }

    if (errors.length > 0) {
      return Promise.reject(errors);
    }

    return Promise.resolve();
  });

  return Event;
};
