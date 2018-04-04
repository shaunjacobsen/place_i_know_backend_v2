const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { sequelize } = require('./../db/pg');
const { SessionKey } = require('./sessionKey');
const { Image } = require('./image');

const User = sequelize.define('profile', {
  profile_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  first_name: {
    type: Sequelize.STRING,
  },
  last_name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  address1: {
    type: Sequelize.STRING,
  },
  address2: {
    type: Sequelize.STRING,
  },
  city: {
    type: Sequelize.STRING,
  },
  state: {
    type: Sequelize.STRING,
  },
  postal: {
    type: Sequelize.STRING,
  },
  country: {
    type: Sequelize.STRING,
  },
  phone: {
    type: Sequelize.STRING,
  },
  phone_abroad: {
    type: Sequelize.STRING,
  },
  gender: {
    type: Sequelize.STRING,
  },
  birthdate: {
    type: Sequelize.DATE,
  },
  passport_name: {
    type: Sequelize.STRING,
  },
  created: {
    type: Sequelize.TIME,
  },
  password: {
    type: Sequelize.STRING,
  },
  emergency_contact: {
    type: Sequelize.STRING,
  },
  // image_id: {
  //   type: Sequelize.INTEGER,
  // },
  last_updated: {
    type: Sequelize.TIME,
  },
}, {
  timestamps: false,
});

User.image_id = User.belongsTo(Image, { foreignKey: 'image_id', targetKey: 'image_id' });
User.hasMany(SessionKey, { foreignKey: 'user_id' });

User.findByCredentials = function(email, password) {
  return this.findOne({ where: { email: email } }).then((user) => {
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
  }).catch(() => {
    console.log('error');
  });
}

User.prototype.generateAuthToken = async function() {
  let token = jwt.sign({ _id: this.profile_id, access: 'auth' }, process.env.JWT_SECRET).toString();
  let session = await SessionKey.create({
    token: token,
    user_id: this.profile_id,
    valid: true,
  });
  return session.token;
}

const generatePassword = (plaintext) => {
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
}

User.afterValidate((user, options) => {
  if (user.changed('password')) {
    return generatePassword(user.password).then((encryptedPassword) => {
      user.password = encryptedPassword;
    }).catch(err => {
      if (err) console.log(err);
    });
  }
});

User.beforeCreate((user, options) => {
  return generatePassword(user.password).then((encryptedPassword) => {
    user.password = encryptedPassword;
  }).catch(err => {
    if (err) console.log(err);
  });
});

module.exports = { User };