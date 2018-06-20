var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        profile_id: { type: DataTypes.INTEGER, primaryKey: true },
        first_name: { type: DataTypes.STRING },
        last_name: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        address1: { type: DataTypes.STRING },
        address2: { type: DataTypes.STRING },
        city: { type: DataTypes.STRING },
        state: { type: DataTypes.STRING },
        postal: { type: DataTypes.STRING },
        country: { type: DataTypes.STRING },
        phone: { type: DataTypes.STRING },
        phone_abroad: { type: DataTypes.STRING },
        gender: { type: DataTypes.STRING },
        birthdate: { type: DataTypes.DATE },
        passport_name: { type: DataTypes.STRING },
        created: { type: DataTypes.TIME },
        password: { type: DataTypes.STRING },
        emergency_contact: { type: DataTypes.STRING },
        role: { type: DataTypes.STRING },
        image_id: { type: DataTypes.INTEGER },
        last_updated: { type: DataTypes.TIME },
    }, {
        timestamps: false,
        tableName: 'profiles',
    });
    User.associate = function (models) {
        User.hasMany(models.session_key, { foreignKey: 'user_id' });
        User.belongsTo(models.image, { foreignKey: 'image_id' });
    };
    User.findByCredentials = function (email, password) {
        return this.findOne({ where: { email } })
            .then(user => {
            if (!user) {
                return Promise.reject();
            }
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) {
                        resolve(user);
                    }
                    else {
                        reject();
                    }
                });
            });
        })
            .catch(e => {
            console.log('e', e);
        });
    };
    User.findByToken = function (token) {
        return sequelize.models.session_key
            .findOne({ where: { token } })
            .then(result => {
            console.log('result', result);
            if (!!result) {
                return Promise.resolve(result);
            }
            return Promise.reject();
        })
            .catch(() => {
            return Promise.reject();
        });
    };
    User.prototype.generateAuthToken = function () {
        return __awaiter(this, void 0, void 0, function* () {
            let token = jwt
                .sign({ _id: this.profile_id, access: 'auth' }, process.env.JWT_SECRET)
                .toString();
            let session = yield sequelize.models.session_key.create({
                token: token,
                user_id: this.profile_id,
                valid: true,
                expires: new Date(new Date().getTime() + 1209600000),
            });
            return session.token;
        });
    };
    User.prototype.getAvatarUrl = function () {
        return __awaiter(this, void 0, void 0, function* () {
            let image = yield sequelize.models.image.findOne({
                where: { image_id: this.image_id },
            });
            return image.secure_url;
        });
    };
    const generatePassword = (plaintext) => __awaiter(this, void 0, void 0, function* () {
        try {
            return yield bcrypt.hash(plaintext, 10);
        }
        catch (e) {
            return null;
        }
    });
    User.beforeUpdate((user, options) => __awaiter(this, void 0, void 0, function* () {
        if (user.changed('password')) {
            try {
                user.password = yield generatePassword(user.password);
            }
            catch (e) {
                console.log(err);
            }
        }
    }));
    User.beforeCreate((user, options) => {
        return generatePassword(user.password)
            .then(encryptedPassword => {
            user.password = encryptedPassword;
        })
            .catch(err => {
            if (err)
                console.log(err);
        });
    });
    return User;
};
