module.exports = (sequelize, DataTypes) => {
  const Operator = sequelize.define(
    'operator',
    {
      operator_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING },
      shortcode: { type: DataTypes.STRING },
      website: { type: DataTypes.STRING },
      customer_service_num: { type: DataTypes.STRING },
      travel_agent_num: { type: DataTypes.STRING },
      image_id: { type: DataTypes.INTEGER },
      created: { type: DataTypes.TIME },
      created_by: { type: DataTypes.INTEGER },
    },
    {
      timestamps: false,
    }
  );

  Operator.belongsTo(sequelize.models.image, { foreignKey: 'image_id' });

  return Operator;
};