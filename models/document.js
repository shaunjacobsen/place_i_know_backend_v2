module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define(
    'document',
    {
      document_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      document_group_id: { type: DataTypes.INTEGER },
      title: { type: DataTypes.STRING },
      s3_url: { type: DataTypes.STRING },
      s3_object: { type: DataTypes.STRING },
      expires: { type: DataTypes.TIME },
      created: { type: DataTypes.TIME },
      created_by: { type: DataTypes.INTEGER },
    },
    {
      timestamps: false,
    }
  );

  Document.prototype.isUserAuthorizedToDownload = async function() {
    try {
      const tripId = await DocumentGroup.findById(this.document_group_id, {
        attributes: ['trip_id'],
      });
      const trip = await Trip.findById(tripId);
      return trip.isUserAuthorizedToView();
    } catch (e) {
      
    }
  };

  return Document;
};
