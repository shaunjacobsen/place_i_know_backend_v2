module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    'image',
    {
      image_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      url: { type: DataTypes.STRING },
      cloudinary_public_id: { type: DataTypes.STRING },
      format: { type: DataTypes.STRING },
      created: { type: DataTypes.TIME },
      secure_url: { type: DataTypes.STRING },
    },
    {
      timestamps: false,
    }
  );
  
  return Image;
};
