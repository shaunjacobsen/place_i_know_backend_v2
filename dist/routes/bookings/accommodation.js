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
module.exports = app => {
    app.get('/accommodation/:id', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const accommodation = yield models.accommodation.findById(req.params.id);
            const trip = yield models.trip.findById(accommodation.trip_id);
            if (trip.isUserAuthorizedToView(req.user)) {
                const data = {
                    accommodation_id: accommodation.accommodation_id,
                    trip_id: accommodation.trip_id,
                    place_id: accommodation.place_id,
                    charge_id: accommodation.charge_id,
                    star_rating: accommodation.star_rating,
                    check_in: accommodation.check_in,
                    check_out: accommodation.check_out,
                    guests: accommodation.guests,
                    rooms: accommodation.rooms,
                    beds: accommodation.beds,
                    breakfast_included: accommodation.breakfast_included,
                    subtotal: accommodation.subtotal,
                    taxes: accommodation.taxes,
                    total: accommodation.total,
                    status: accommodation.status,
                    notes: accommodation.notes,
                };
                res.json(data);
            }
            else {
                res.status(401).send();
            }
        }
        catch (e) {
            res.status(400).send(e);
        }
    }));
    app.post('/accommodation/:id/select', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const accommodation = yield models.accommodation.findById(req.params.id);
            const trip = yield models.trip.findById(accommodation.trip_id);
            if (trip.isUserAuthorizedToView(req.user)) {
                const accommodations = yield accommodation.markAsSelected();
                if (accommodations.error) {
                    res.status(400).json({ error: accommodations.error });
                }
                res.json(filterAccommodationGroupData(accommodations));
            }
            else {
                res.status(401).send();
            }
        }
        catch (e) {
            res.status(400).json(e);
        }
    }));
};
