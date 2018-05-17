const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
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
    },
    {
      timestamps: false,
      tableName: 'profiles',
    }
  );

  User.associate = function(models) {
    User.hasMany(models.session_key, { foreignKey: 'user_id' });
    User.belongsTo(models.image, { foreignKey: 'image_id' });
  };

  User.findByCredentials = function(email, password) {
    return this.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return Promise.reject();
        }

        return new Promise((resolve, reject) => {
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              resolve(user);
            } else {
              reject();
            }
          });
        });
      })
      .catch(e => {
        console.log('e', e);
      });
  };

  User.findByToken = function(token) {
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

  User.prototype.generateAuthToken = async function() {
    let token = jwt
      .sign({ _id: this.profile_id, access: 'auth' }, process.env.JWT_SECRET)
      .toString();
    let session = await sequelize.models.session_key.create({
      token: token,
      user_id: this.profile_id,
      valid: true,
      expires: new Date(new Date().getTime() + 1209600000), // 2 weeks
    });
    return session.token;
  };

  User.prototype.getAvatarUrl = async function() {
    let image = await sequelize.models.image.findOne({
      where: { image_id: this.image_id },
    });
    return image.secure_url;
  };

  const generatePassword = async plaintext => {
    try {
      return await bcrypt.hash(plaintext, 10);
    } catch (e) {
      return null;
    }
  };

  User.beforeUpdate(async (user, options) => {
    if (user.changed('password')) {
      try {
        user.password = await generatePassword(user.password);
      } catch (e) {
        console.log(err);
      }
    }
  });

  User.beforeCreate((user, options) => {
    return generatePassword(user.password)
      .then(encryptedPassword => {
        user.password = encryptedPassword;
      })
      .catch(err => {
        if (err) console.log(err);
      });
  });

  return User;
};
