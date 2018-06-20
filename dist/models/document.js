var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { generateRandomString } = require('./../functions/randomString');
module.exports = (sequelize, DataTypes) => {
    const Document = sequelize.define('document', {
        document_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        document_group_id: { type: DataTypes.INTEGER },
        title: { type: DataTypes.STRING },
        s3_url: { type: DataTypes.STRING },
        s3_object: { type: DataTypes.STRING },
        uploaded: { type: DataTypes.BOOLEAN, default: false },
        expires: { type: DataTypes.TIME },
        created: { type: DataTypes.TIME },
        created_by: { type: DataTypes.INTEGER },
    }, {
        timestamps: false,
    });
    Document.prototype.isUserAuthorizedToDownload = function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tripId = yield DocumentGroup.findById(this.document_group_id, {
                    attributes: ['trip_id'],
                });
                const trip = yield Trip.findById(tripId);
                return trip.isUserAuthorizedToView();
            }
            catch (e) { }
        });
    };
    Document.createNew = function (data, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            const usingExistingDocumentGroup = data.document_group_id !== 'new';
            const newFileName = `${generateRandomString()}.pdf`;
            try {
                if (usingExistingDocumentGroup) {
                    const newDocument = yield Document.build({
                        document_group_id: data.document_group_id,
                        title: data.file_name,
                        s3_object: newFileName,
                        expires: data.expires,
                        created: new Date(),
                        created_by: meta._id,
                    }).save();
                    return newDocument;
                }
                else {
                    const newDocumentGroup = yield sequelize.models.document_group.build({
                        trip_id: data.trip_id,
                        title: data.new_document_group,
                        created: new Date(),
                        created_by: meta._id,
                    }).save();
                    const newDocument = yield Document.build({
                        document_group_id: newDocumentGroup.document_group_id,
                        title: data.file_name,
                        s3_object: newFileName,
                        expires: data.expires,
                        created: new Date(),
                        created_by: meta._id,
                    }).save();
                    return newDocument;
                }
            }
            catch (e) {
                return e;
            }
        });
    };
    return Document;
};
