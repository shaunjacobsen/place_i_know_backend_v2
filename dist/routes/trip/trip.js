var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const models = require('./../../models');
const { authenticate, permit } = require('./../../middleware/authenticate');
const { filterAccommodationGroupData } = require('./../../functions/accommodationGroup');
const { filterFlightGroupData } = require('./../../functions/flightGroup');
const { filterTrainGroupData } = require('./../../functions/trainGroup');
const flattenArray = arr => {
    return arr.reduce((a, b) => {
        return a.concat(b);
    });
};
module.exports = app => {
    app.get('/trip', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let trips = yield models.trip.findByUser(req.user.profile_id);
        res.json(trips);
    }));
    app.get('/trip/:tripId/itineraries', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let trip = yield models.trip.findById(req.params.tripId);
            if (yield trip.isUserAuthorizedToView(req.user)) {
                let itineraries = yield models.itinerary.findAll({
                    where: { trip_id: trip.trip_id },
                });
                res.json(itineraries);
            }
            res.status(401).send();
        }
        catch (e) {
            res.status(400).json(e);
        }
    }));
    app.get('/trip/:tripId/places', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let trip = yield models.trip.findById(req.params.tripId);
            if (yield trip.isUserAuthorizedToView(req.user)) {
                let itinerary = yield models.itinerary.findOne({
                    where: { trip_id: trip.trip_id },
                });
                let eventPlaces = yield itinerary.getListOfEventPlaces();
                let accommodationPlaces = yield trip.getListOfAccommodationPlaces();
                let flightPlaces = yield trip.getListOfFlightPlaces();
                let trainPlaces = yield trip.getListOfTrainPlaces();
                let concatenatedPlaceIds = eventPlaces.concat(accommodationPlaces, flattenArray(flightPlaces), flattenArray(trainPlaces));
                let placesList = yield models.place.findAll({
                    where: { place_id: { $in: concatenatedPlaceIds } },
                    include: {
                        model: models.image,
                        attributes: ['secure_url'],
                    },
                });
                res.json(placesList);
            }
            else {
                res.status(401).send();
            }
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    app.get('/trip/:tripId/accommodation_groups', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let trip = yield models.trip.findById(req.params.tripId);
            if (yield trip.isUserAuthorizedToView(req.user)) {
                let accommodationGroups = yield trip.getListOfAccommodationGroups();
                const data = filterAccommodationGroupData(accommodationGroups);
                res.json(data);
            }
            else {
                res.status(401).send();
            }
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    app.get('/trip/:tripId/accommodations', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let trip = yield models.trip.findById(req.params.tripId);
            if (yield trip.isUserAuthorizedToView(req.user)) {
                let accommodations = yield trip.getListOfAccommodations();
                res.json(accommodations);
            }
            else {
                res.status(401).send();
            }
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    app.get('/trip/:tripId/flight_groups', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let trip = yield models.trip.findById(req.params.tripId);
            if (yield trip.isUserAuthorizedToView(req.user)) {
                let flightGroups = yield trip.getListOfFlightGroups();
                const data = filterFlightGroupData(flightGroups);
                res.json(data);
            }
            else {
                res.status(401).send();
            }
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    app.get('/trip/:tripId/flights', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let trip = yield models.trip.findById(req.params.tripId);
            if (yield trip.isUserAuthorizedToView(req.user)) {
                let flights = yield trip.getListOfFlights();
                res.json(flights);
            }
            else {
                res.status(401).send();
            }
        }
        catch (e) {
            res.status(400).json(e);
        }
    }));
    app.get('/trip/:tripId/train_groups', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let trip = yield models.trip.findById(req.params.tripId);
            if (yield trip.isUserAuthorizedToView(req.user)) {
                let trainGroups = yield trip.getListOfTrainGroups();
                const data = filterTrainGroupData(trainGroups);
                res.json(data);
            }
            else {
                res.status(401).send();
            }
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    app.get('/trip/:tripId/trains', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let trip = yield models.trip.findById(req.params.tripId);
            if (yield trip.isUserAuthorizedToView(req.user)) {
                let trains = yield trip.getListOfTrains();
                res.json(trains);
            }
            else {
                res.status(401).send();
            }
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    app.get('/trip/:id/attendees', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let trip = yield models.trip.findById(req.params.id);
            if (trip.isUserAuthorizedToView(req.user)) {
                const attendees = yield trip.listAttendees();
                res.json(attendees);
            }
            else {
                res.status(401).send();
            }
        }
        catch (e) {
            res.status(400).json(e);
        }
    }));
    app.get('/trip/:tripId/document_groups', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let trip = yield models.trip.findById(req.params.tripId);
            if (yield trip.isUserAuthorizedToView(req.user)) {
                let documentGroups = yield trip.getListOfDocumentGroups();
                res.json(documentGroups);
            }
            else {
                res.status(401).send();
            }
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    app.get('/trip/:tripId/charges', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let trip = yield models.trip.findById(req.params.tripId);
            if (yield trip.isUserAuthorizedToView(req.user)) {
                let charges = yield trip.getListOfCharges();
                res.json(charges);
            }
            else {
                res.status(401).send();
            }
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    app.get('/admin/trip', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const allTrips = yield models.trip.findAll();
            res.json(allTrips);
        }
        catch (e) {
            res.status(400).send();
        }
    }));
    app.get('/admin/trip/:id', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const trip = yield models.trip.findById(req.params.id);
            res.json(trip);
        }
        catch (e) {
            res.status(400).send();
        }
    }));
    app.post('/admin/trip', authenticate, permit('admin'), (req, res) => {
        models.Trip.build({
            title: req.body.title,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            attendees: req.body.attendees,
            created_by: req.user._id,
        })
            .save()
            .then(trip => {
            res.json(trip);
        })
            .catch(e => res.status(400).json({ errors: e.errors }));
    });
    app.patch('/admin/trip/:tripId', authenticate, permit('admin'), (req, res) => {
        models.Trip.findById(req.params.tripId)
            .then(trip => {
            trip
                .update({
                title: req.body.title,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                attendees: req.body.attendees,
            }, {
                fields: Object.keys(req.body),
            })
                .then(updatedTrip => {
                res.status(200).json(updatedTrip);
            })
                .catch(e => res.status(400).json({ errors: e }));
        })
            .catch(e => res.status(404).json({ errors: e }));
    });
    app.delete('/admin/trip/:tripId', authenticate, permit('admin'), (req, res) => {
        models.Trip.findById(req.params.tripId)
            .then(trip => {
            trip
                .destroy()
                .then(() => res.status(200).send())
                .catch(e => res.status(400).json({ errors: e }));
        })
            .catch(e => res.status(404).send());
    });
};
