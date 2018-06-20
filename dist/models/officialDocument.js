const crypto = require('crypto');
const { generateRandomString } = require('./../functions/randomString');
module.exports = (sequelize, DataTypes) => {
    const OfficialDocument = sequelize.define('official_document', {
        official_document_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        document_type: { type: DataTypes.STRING },
        full_name: { type: DataTypes.STRING },
        identification_number: { type: DataTypes.STRING },
        issue_locality: { type: DataTypes.STRING },
        issue_date: { type: DataTypes.DATE },
        expiration_date: { type: DataTypes.DATE },
        notes: { type: DataTypes.STRING },
        created: { type: DataTypes.TIME },
        created_by: { type: DataTypes.INTEGER },
        last_updated: { type: DataTypes.TIME },
        last_updated_by: { type: DataTypes.INTEGER },
    }, {
        timestamps: false,
    });
    OfficialDocument.prototype.selectiveDecrypt = function () {
        return {
            full_name: decipher(this.full_name),
            identification_number: obscureAllButLastNDigits(decipher(this.identification_number), 4),
            issue_locality: decipher(this.issue_locality),
            issue_date: decipher(this.issue_date),
            expiration_date: decipher(this.expiration_date),
            notes: decipher(this.notes),
        };
    };
    const obscureAllButLastNDigits = (string, digits) => {
        const totalLength = string.length;
        let returnString = '';
        for (var i = 0; i < totalLength - digits; i++) {
            returnString += '*';
        }
        returnString += string.substr(totalLength - digits);
        return returnString;
    };
    const encrypt = plaintext => {
        const cipher = crypto.createCipheriv('aes-256-ctr', process.env.CIPHER, generateRandomString());
        const crypted = cipher.update(plaintext, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    };
    const decipher = encryptedText => {
        const decipher = crypto.createDecipheriv('aes-256-ctr', process.env.CIPHER, generateRandomString());
        const deciphered = decipher.update(encryptedText, 'hex', 'utf8');
        deciphered += decipher.final('utf8');
        return deciphered;
    };
    OfficialDocument.beforeCreate((doc, options) => {
        try {
            doc.full_name = encrypt(doc.full_name);
            doc.identification_number = encrypt(doc.identification_number);
            doc.issue_locality = encrypt(doc.issue_locality);
            doc.issue_date = encrypt(doc.issue_date);
            doc.expiration_date = encrypt(doc.expiration_date);
            doc.notes = encrypt(doc.notes);
        }
        catch (e) {
            throw new Error('Could not properly encrypt data.');
        }
    });
    return OfficialDocument;
};
