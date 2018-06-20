var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
module.exports = (sequelize, DataTypes) => {
    const PasswordResetToken = sequelize.define('password_reset_token', {
        password_set_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: { type: DataTypes.INTEGER },
        email: { type: DataTypes.STRING },
        reset_token: { type: DataTypes.STRING },
        sent_at: { type: DataTypes.TIME },
        expires: { type: DataTypes.TIME },
        used: { type: DataTypes.BOOLEAN, default: false },
    }, {
        timestamps: false,
        tableName: 'password_set_tokens',
    });
    PasswordResetToken.generateAndSave = (user) => __awaiter(this, void 0, void 0, function* () {
        const token = uuid();
        const encryptedToken = yield bcrypt.hash(token, 10);
        return new Promise((resolve, reject) => {
            PasswordResetToken.build({
                user_id: user.profile_id,
                email: user.email,
                reset_token: encryptedToken,
                sent_at: new Date(),
                expires: new Date(new Date().getTime() + 21600000),
            })
                .save()
                .then(data => {
                resolve({ token, id: data.password_set_id });
            })
                .catch(e => reject(e));
        });
    });
    PasswordResetToken.prototype.isValid = function (token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const match = yield bcrypt.compare(token, this.reset_token);
                if (match) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                return false;
            }
        });
    };
    return PasswordResetToken;
};
