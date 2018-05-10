const bcrypt = require('bcrypt');

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
    User.hasOne(models.image, { foreignKey: 'image_id' });
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
      .catch(() => {
        console.log('error');
      });
  };

  User.findByToken = function(token) {
    return SessionKey.findOne({ where: { token } })
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
    let session = await SessionKey.create({
      token: token,
      user_id: this.profile_id,
      valid: true,
      expires: new Date(new Date().getTime() + 1209600000), // 2 weeks
    });
    return session.token;
  };

  User.prototype.getAvatarUrl = async function() {
    let image = await Image.findOne({ where: { image_id: this.image_id } });
    return image.secure_url;
  };

  const generatePassword = plaintext => {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          reject(err);
        }

        bcrypt.hash(plaintext, salt, (err, hash) => {
          if (!err) {
            resolve(hash);
          } else {
            reject(err);
          }
        });
      });
    });
  };

  User.afterValidate((user, options) => {
    if (user.changed('password')) {
      return generatePassword(user.password)
        .then(encryptedPassword => {
          user.password = encryptedPassword;
        })
        .catch(err => {
          if (err) console.log(err);
        });
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
