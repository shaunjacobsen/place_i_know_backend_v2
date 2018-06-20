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
module.exports = app => {
    app.get('/itinerary/:itineraryId/events', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let itinerary = yield models.Itinerary.findById(req.params.itineraryId);
            if (yield itinerary.isUserAuthorizedToView(req.user)) {
                let events = yield itinerary.getEvents();
                res.json(events);
            }
            else {
                res.status(401).send();
            }
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    app.get('/event/:eventId', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let event = yield models.Event.findById(req.params.eventId, {
                include: [
                    {
                        model: Image,
                        attributes: ['secure_url'],
                    },
                ],
            });
            let itinerary = yield models.Itinerary.findById(event.itinerary_id);
            if (itinerary.isUserAuthorizedToView(req.user)) {
                res.json(event);
            }
            else {
                res.status(401).send();
            }
        }
        catch (error) {
            res.status(400).json(error);
        }
    }));
    app.post('/admin/event', authenticate, permit('admin'), (req, res) => {
        models.event.build({
            itinerary_id: req.body.itinerary_id,
            event_type: req.body.event_type,
            subtype: req.body.subtype,
            event_attributes: req.body.attributes,
            title: req.body.title,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            duration: req.body.duration,
            notes: req.body.notes,
            places: req.body.places,
            start_tz: req.body.start_tz,
            end_tz: req.body.end_tz,
            price: req.body.price,
            is_prepaid: req.body.is_prepaid,
            currency: req.body.currency,
            price_is_approximate: req.body.price_is_approximate,
            created_by: req.user._id,
        })
            .save()
            .then(event => {
            res.json(event);
        })
            .catch(e => res.status(400).json({ errors: e }));
    });
    app.patch('/admin/event/:eventId', authenticate, permit('admin'), (req, res) => {
        models.event.findById(req.params.eventId)
            .then(event => {
            event
                .update({
                itinerary_id: req.body.itinerary_id,
                event_type: req.body.event_type,
                subtype: req.body.subtype,
                event_attributes: req.body.attributes,
                title: req.body.title,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                duration: req.body.duration,
                notes: req.body.notes,
                places: req.body.places,
                start_tz: req.body.start_tz,
                end_tz: req.body.end_tz,
                price: req.body.price,
                is_prepaid: req.body.is_prepaid,
                currency: req.body.currency,
                price_is_approximate: req.body.price_is_approximate,
            }, {
                fields: Object.keys(req.body),
            })
                .then(updatedEvent => {
                res.status(200).json(updatedEvent);
            })
                .catch(e => res.status(400).json({ errors: e }));
        })
            .catch(e => res.status(404).json({ errors: e }));
    });
    app.delete('/admin/event/:eventId', authenticate, permit('admin'), (req, res) => {
        models.Event.findById(req.params.eventId)
            .then(event => {
            event
                .destroy()
                .then(() => res.status(200).send())
                .catch(e => res.status(400).json({ errors: e }));
        })
            .catch(e => res.status(404).send());
    });
};
