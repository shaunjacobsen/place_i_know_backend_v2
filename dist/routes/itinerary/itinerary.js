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
const { reduceDaysToArray } = require('./../../functions/itinerary');
module.exports = app => {
    app.get('/itinerary/:itineraryId', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let itinerary = yield models.itinerary.findById(req.params.itineraryId);
            if (yield itinerary.isUserAuthorizedToView(req.user)) {
                data = {
                    trip_id: itinerary.trip_id,
                    itinerary_id: itinerary.itinerary_id,
                    start_date: itinerary.start_date,
                    end_date: itinerary.end_date,
                    days: reduceDaysToArray(yield itinerary.getListOfDays()),
                };
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
    app.get('/itinerary/:itineraryId/days', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let itinerary = yield models.itinerary.findById(req.params.itineraryId);
            if (yield itinerary.isUserAuthorizedToView(req.user)) {
                let data = yield models.day.findAll({
                    where: { itinerary_id: itinerary.itinerary_id },
                });
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
    app.get('/itinerary/:itineraryId/dates', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let itinerary = yield models.Itinerary.findById(req.params.itineraryId);
            if (yield itinerary.isUserAuthorizedToView(req.user)) {
                const events = yield itinerary.getDateRangeOfItineraryEvents();
                const data = events.map(event => {
                    return event.date;
                });
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
    app.get('/itinerary/:itineraryId/events', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let itinerary = yield models.itinerary.findById(req.params.itineraryId);
            if (yield itinerary.isUserAuthorizedToView(req.user)) {
                if (req.query.verbose === 'true') {
                    const events = yield itinerary.getVerboseListOfEvents();
                    res.json(events);
                }
                else {
                    const events = yield itinerary.getListOfEvents();
                    res.json(events);
                }
            }
            else {
                res.status(401).send();
            }
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    app.post('/admin/itinerary', authenticate, permit('admin'), (req, res) => {
        models.Itinerary.build({
            trip_id: req.body.trip_id,
            title: req.body.title,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            itineraryAttributes: req.body.attributes,
            status: req.body.status,
            created_by: req.user._id,
        })
            .save()
            .then(itinerary => {
            res.json(itinerary);
        })
            .catch(e => res.status(400).json({ errors: e }));
    });
    app.patch('/admin/itinerary/:itineraryId', authenticate, permit('admin'), (req, res) => {
        models.Itinerary.findById(req.params.itineraryId)
            .then(itinerary => {
            itinerary
                .update({
                trip_id: req.body.trip_id,
                title: req.body.title,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                itineraryAttributes: req.body.attributes,
                status: req.body.status,
            }, {
                fields: Object.keys(req.body),
            })
                .then(updatedItinerary => {
                res.status(200).json(updatedItinerary);
            })
                .catch(e => res.status(400).json({ errors: e }));
        })
            .catch(e => res.status(404).json({ errors: e }));
    });
    app.delete('/admin/itinerary/:itineraryId', authenticate, permit('admin'), (req, res) => {
        models.Itinerary.findById(req.params.itineraryId)
            .then(itinerary => {
            itinerary
                .destroy()
                .then(() => res.status(200).send())
                .catch(e => res.status(400).json({ errors: e }));
        })
            .catch(e => res.status(404).send());
    });
};
