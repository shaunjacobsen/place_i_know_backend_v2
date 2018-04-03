const request = require('supertest');
const expect = require('expect');
const jwt = require('jsonwebtoken');

const { app } = require('./../app');
const { users, insertUsers } = require('./seed/userData');

describe('POST /signin', function() {

  beforeEach(() => {
    return insertUsers(users);
  });

  it('Should sign in a user with the correct credentials', async () => {
    const res = await request(app).post('/signin').send({
      email: users[0].email,
      password: users[0].password,
    });
    expect(res.statusCode).toBe(200);
  });

  it('Should return the correct JSON web token', async () => {
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