const request = require('supertest');
const expect = require('expect');
const jwt = require('jsonwebtoken');

const { app } = require('./../app');
const { SessionKey } = require('./../models/sessionKey');
const { users, populateUsers, destroyUsers } = require('./seed/userData');
const { allImages, populateImages, destroyImages } = require('./seed/imageData');
const { allTrips, populateTrips, destroyTrips } = require('./seed/tripData');

describe('GET /trip', function() {

  beforeEach(() => {
    populateImages(allImages);
    populateUsers(users);
    return populateTrips(allTrips);
  });

  afterEach(() => {
    destroyImages();
    destroyUsers();
    return destroyTrips();
  });

  it('Should show only the trips for this user', async (done) => {
    const signInRequest = await request(app).post('/signin').send({
      email: users[1].email,
      password: users[1].password,
    });
    let assignedToken = signInRequest.headers['x-auth'];
    const res = await request(app).get('/trip').set('x-auth', assignedToken);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    done();
  });

});