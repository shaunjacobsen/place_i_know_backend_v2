const request = require('supertest');
const expect = require('expect');
const jwt = require('jsonwebtoken');

const { app } = require('./../app');
const { users, populateUsers, destroyUsers } = require('./seed/userData');
const { allImages, populateImages, destroyImages } = require('./seed/imageData');

describe('POST /signin', function() {

  beforeAll(() => {
    return populateUsers(users);
  });

  afterAll(() => {
    return destroyUsers();
  });

  it('Should sign in a user with the correct credentials', async () => {
    const res = await request(app).post('/signin').send({
      email: users[0].email,
      password: users[0].password,
    });
    expect(res.statusCode).toBe(200);
  });

  it.skip('Should return the correct JSON web token', async () => {
    const res = await request(app).post('/signin').send({
      email: users[0].email,
      password: users[0].password,
    });
    const sampleJwt = jwt.sign({ _id: users[0].profile_id, access: 'auth' }, process.env.JWT_SECRET).toString();
    expect(res.statusCode).toBe(200);
    expect(res.headers).toHaveProperty('x-auth');
    expect(res.headers['x-auth']).toBe(sampleJwt);
  });

  it('Should not sign in a user with an incorrect password', async () => {
    const res = await request(app).post('/signin').send({
      email: users[0].email,
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(400);
  });

  it('Should not sign in a user with an incorrect email', async () => {
    const res = await request(app).post('/signin').send({
      email: 'bademail@gmail.com',
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(400);
  });

});

describe('GET /user', function() {

  beforeAll(() => {
    populateImages(allImages);
    return populateUsers(users);
  });

  afterAll(() => {
    destroyImages();
    return destroyUsers();
  });

  it('Should show the current user\'s information', async (done) => {
    await request(app).post('/signin').send({
      email: users[0].email,
      password: users[0].password,
    });
    const xAuth = jwt.sign({ _id: users[0].profile_id, access: 'auth' }, process.env.JWT_SECRET).toString();
    const res = await request(app).get('/user').set('x-auth', xAuth);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(users[0].email);
    expect(res.body.first_name).toBe(users[0].first_name);
    expect(res.body.last_name).toBe(users[0].last_name);
    done();
  });

  it('Should return the current user\'s avatar image URL', async (done) => {
    await request(app).post('/signin').send({
      email: users[0].email,
      password: users[0].password,
    });
    const xAuth = jwt.sign({ _id: users[0].profile_id, access: 'auth' }, process.env.JWT_SECRET).toString();
    const res = await request(app).get('/user').set('x-auth', xAuth);
    expect(res.statusCode).toBe(200);
    expect(res.body.image.secure_url).toBe(allImages[0].secure_url);
    done();
  });

});