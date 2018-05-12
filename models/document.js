const { generateRandomString } = require('./../functions/randomString');

module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define(
    'document',
    {
      document_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      document_group_id: { type: DataTypes.INTEGER },
      title: { type: DataTypes.STRING },
      s3_url: { type: DataTypes.STRING },
      s3_object: { type: DataTypes.STRING },
      uploaded: { type: DataTypes.BOOLEAN, default: false },
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
    } catch (e) {}
  };

  Document.createNew = async function(data, meta) {
    const usingExistingDocumentGroup = data.document_group_id !== 'new';
    const newFileName = `${generateRandomString()}.pdf`;
    try {
      if (usingExistingDocumentGroup) {
        const newDocument = await Document.build({
          document_group_id: data.document_group_id,
          title: data.file_name,
          s3_object: newFileName,
          expires: data.expires,
          created: new Date(),
          created_by: meta._id,
        }).save();
        return newDocument;
      } else {
        const newDocumentGroup = await sequelize.models.document_group.build({
          trip_id: data.trip_id,
          title: data.new_document_group,
          created: new Date(),
          created_by: meta._id,
        }).save();
        const newDocument = await Document.build({
          document_group_id: newDocumentGroup.document_group_id,
          title: data.file_name,
          s3_object: newFileName,
          expires: data.expires,
          created: new Date(),
          created_by: meta._id,
        }).save();
        return newDocument;
      }
    } catch (e) {
      return e;
    }
  };

  return Document;
};
