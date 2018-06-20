var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const request = require('supertest');
const expect = require('expect');
const jwt = require('jsonwebtoken');
const { app } = require('./../app');
const { SessionKey } = require('./../models/sessionKey');
const { allImages, populateImages, destroyImages } = require('./seed/imageData');
const { users, populateUsers, destroyUsers } = require('./seed/userData');
const { allTrips, populateTrips, destroyTrips } = require('./seed/tripData');
describe('GET /trip', function () {
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
    it.skip('Should show only the trips for this user', (done) => __awaiter(this, void 0, void 0, function* () {
        const signInRequest = yield request(app).post('/signin').send({
            email: users[1].email,
            password: users[1].password,
        });
        let assignedToken = signInRequest.headers['x-auth'];
        const res = yield request(app).get('/trip').set('x-auth', assignedToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        done();
    }));
});
describe('POST /admin/trip', function () {
    let token;
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        token = yield scaffoldAdmin();
    }));
    afterAll(() => {
        return teardownAdmin();
    });
    it('Should add a new trip', (done) => __awaiter(this, void 0, void 0, function* () {
        const res = yield request(app)
            .post('/admin/trip')
            .set('x-auth', token)
            .send({
            title: 'Paris Trip',
            start_date: '2018-08-01',
            end_date: '2018-08-08',
            attendees: [1],
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Paris Trip');
        done();
    }));
});
