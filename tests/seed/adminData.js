const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const request = require('supertest');

const { app } = require('./../../app');
const { User } = require('./../../models/user');

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
  image_id: 1,
  role: 'admin',
}

const insertUser = async (user) => {
  try {
    return await User.create(user);
  } catch (error) {
    console.log(error);
  }
}

const getToken = async (user) => {
  try {
    return await user.generateAuthToken();
  } catch (error) {
    console.log('could not get token:', error);
  }
}

const scaffoldAdmin = async () => {
  try {
    let user = await insertUser(adminUser);
    return await getToken(user);
  } catch (error) {
    console.log('could not scaffold admin:', error)
  }
}

const teardownAdmin = async () => {
  try {
    await User.destroy({ truncate: true });
  } catch (error) {
    console.log('could not tear down admin:', error)
  }
}

module.exports = { scaffoldAdmin, teardownAdmin, getToken, adminUser };