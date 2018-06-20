var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Trip } = require('./../../models/trip');
const { users } = require('./userData');
const tripOne = {
    title: 'New York Summer 2018',
    start_date: '2018-05-31 00:00:00',
    end_date: '2018-06-04 00:00:00',
    created: '2017-09-27 21:20:34.367Z',
    tripAttributes: { confirmed: true },
    attendees: [users[1].profile_id]
};
const tripTwo = {
    title: 'Paris Summer 2018',
    start_date: '2018-08-01 00:00:00',
    end_date: '2018-08-09 00:00:00',
    created: '2018-02-27 21:20:34.367Z',
    tripAttributes: { confirmed: true },
    attendees: [users[0].profile_id]
};
const allTrips = [tripOne, tripTwo];
const populateTrips = (trips) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield Trip.bulkCreate(trips);
    }
    catch (error) {
        console.log('error populating trips', error);
    }
});
const destroyTrips = () => __awaiter(this, void 0, void 0, function* () {
    try {
        yield Trip.destroy();
    }
    catch (error) {
        console.log('error destroying trips', error);
    }
});
module.exports = { allTrips, populateTrips, destroyTrips };
