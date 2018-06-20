module.exports = (sequelize, DataTypes) => {
  const DocumentGroup = sequelize.define(
    'document_group',
    {
      document_group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      trip_id: { type: DataTypes.INTEGER },
      title: { type: DataTypes.STRING },
      created: { type: DataTypes.TIME },
      created_by: { type: DataTypes.INTEGER },
    },
    {
      timestamps: false,
    }
  );

  DocumentGroup.associate = function(models) {
    DocumentGroup.hasMany(models.document, { foreignKey: 'document_group_id' });
  };

  return DocumentGroup;
};
