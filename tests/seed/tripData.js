const { Trip } = require('./../../models/trip');
const { users } = require('./userData');

const tripOne = {
  title: 'New York Summer 2018',
  start_date: '2018-05-31 00:00:00',
  end_date: '2018-06-04 00:00:00',
  created: '2017-09-27 21:20:34.367Z',
  tripAttributes: { confirmed: true },
  attendees: [users[1].profile_id]
}

const tripTwo = {
  title: 'Paris Summer 2018',
  start_date: '2018-08-01 00:00:00',
  end_date: '2018-08-09 00:00:00',
  created: '2018-02-27 21:20:34.367Z',
  tripAttributes: { confirmed: true },
  attendees: [users[0].profile_id]
}

const allTrips = [tripOne, tripTwo];

const populateTrips = async (trips) => {
  try {
    await Trip.bulkCreate(trips);
  } catch (error) {
    console.log('error populating trips', error);
  }
}

const destroyTrips = async () => {
  try {
    await Trip.destroy();
  } catch (error) {
    console.log('error destroying trips', error);
  }
}

module.exports = { allTrips, populateTrips, destroyTrips };