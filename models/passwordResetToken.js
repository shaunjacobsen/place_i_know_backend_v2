const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define(
    'password_reset_token',
    {
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
    },
    {
      timestamps: false,
      tableName: 'password_set_tokens',
    }
  );

  PasswordResetToken.generateAndSave = async user => {
    const token = uuid();
    const encryptedToken = await bcrypt.hash(token, 10);
    return new Promise((resolve, reject) => {
      PasswordResetToken.build({
        user_id: user.profile_id,
        email: user.email,
        reset_token: encryptedToken,
        sent_at: new Date(),
        expires: new Date(new Date().getTime() + 21600000), // 6 hours
      })
        .save()
        .then(data => {
          resolve({ token, id: data.password_set_id });
        })
        .catch(e => reject(e));
    });
  };

  PasswordResetToken.prototype.isValid = async function(token) {
    try {
      const match = await bcrypt.compare(token, this.reset_token);
      if (match) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  return PasswordResetToken;
};
