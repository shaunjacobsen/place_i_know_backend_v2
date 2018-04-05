const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User } = require('./../../models/user');
const { SessionKey } = require('./../../models/sessionKey');

const adminUser = {
  profile_id: 1,
  first_name: 'Shaun',
  last_name: 'Jacobsen',
  email: 'testadmin@gmail.com',
  address1: '123 Travel St',
  address2: 'Apartment 2',
  city: 'New York',
  state: 'NY',
  postal: '10002',
  country: 'USA',
  phone: ' +17180000000',
  phone_abroad: '+17180000000',
  gender: 'M',
  birthdate: '1985-08-01',
  passport_name: 'Shaun Jacobsen',
  password: 'password123',
  emergency_contact: 'Unlisted',
  image_id: 1
}

const userTwo = {
  profile_id: 2,
  first_name: 'Ilana',
  last_name: 'Wexler',
  email: 'ilana@gmail.com',
  address1: '566 Gowanus St',
  address2: '3A',
  city: 'Brooklyn',
  state: 'NY',
  postal: '11221',
  country: 'USA',
  phone: ' +7180001234',
  phone_abroad: '+7180001234',
  gender: 'F',
  birthdate: '1985-01-06',
  passport_name: 'Ilana Wexler',
  password: 'yaskween123',
  emergency_contact: 'Unlisted',
  image_id: 1
}

const users = [adminUser, userTwo];

const populateUsers = async (users) => {
  try {
    await User.bulkCreate(users, {
      individualHooks: true,
    });
  } catch (error) {
    
  }
}

const destroyUsers = async () => {
  try {
    await User.destroy({ truncate: true });
    await SessionKey.destroy({ truncate: true });
  } catch (error) {
    
  }
}

const truncateTokens = () => {
  return new Promise((resolve, reject) => {
    SessionKey.destroy({ truncate: true }).then(() => {
      resolve();
    }).catch((e) => {
      reject(e);
    });
  });
}

module.exports = { users, populateUsers, destroyUsers };