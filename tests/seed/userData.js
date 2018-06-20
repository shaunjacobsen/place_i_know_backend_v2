const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const models = require('./../../models');

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
};

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
  image_id: 1,
  role: 'user',
};

const userThree = {
  profile_id: 3,
  first_name: 'Eurydice Colette Clytemnestra Dido Bathsheba Rabelais Patricia',
  last_name: 'Cocteau Stone',
  email: 'patsy@vogue.co.uk',
  address1: '109 Knightsbridge',
  address2: '',
  city: 'Belgravia',
  state: 'London',
  postal: 'SW1X 7RJ',
  country: 'United Kingdom',
  phone: ' +442072355000',
  phone_abroad: '+442072355000',
  gender: 'F',
  birthdate: '1950-10-30',
  passport_name: 'Patsy Stone',
  password: 'domandbom456',
  emergency_contact: 'Eddy Monsoon',
  image_id: 1,
  role: 'user',
};

const users = [adminUser, userTwo, userThree];

const populateUsers = async users => {
  try {
    await models.user.bulkCreate(users, {
      individualHooks: true,
    });
  } catch (error) {}
};

const destroyUsers = async () => {
  try {
    await models.user.destroy();
    await models.session_key.destroy();
  } catch (error) {}
};

module.exports = { users, populateUsers, destroyUsers };
