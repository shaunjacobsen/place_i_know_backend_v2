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
  image_id: 82
}

const users = [adminUser];

const insertUsers = async (users) => {
  try {
    await User.destroy({ truncate: true });
    await SessionKey.destroy({ truncate: true });
    await User.bulkCreate(users, {
      individualHooks: true,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { users, insertUsers };