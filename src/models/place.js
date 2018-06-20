module.exports = (sequelize, DataTypes) => {
  const Place = sequelize.define(
    'place',
    {
      place_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      type: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      full_address: { type: DataTypes.STRING },
      address1: { type: DataTypes.STRING },
      address2: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      postal: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
      website: { type: DataTypes.STRING },
      google_id: { type: DataTypes.STRING },
      latitude: { type: DataTypes.STRING, allowNull: false },
      longitude: { type: DataTypes.STRING, allowNull: false },
      tags: { type: DataTypes.ARRAY(DataTypes.STRING) },
      place_attributes: { field: 'attributes', type: DataTypes.STRING },
      notes: { type: DataTypes.STRING },
      hours: { type: DataTypes.JSONB },
      created: { type: DataTypes.TIME },
      created_by: { type: DataTypes.INTEGER },
    },
    {
      timestamps: false,
    }
  );

  Place.associations = function(models) {
    Place.belongsTo(models.image, {
      foreignKey: 'image_id',
      targetKey: 'image_id',
    });
  };

  return Place;
};
