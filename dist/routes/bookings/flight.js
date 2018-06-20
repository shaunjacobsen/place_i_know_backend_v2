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
const { filterFlightGroupData } = require('./../../functions/flightGroup');
module.exports = app => {
    app.post('/flight/:id/select', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const flight = yield models.flight.findById(req.params.id);
            const trip = yield models.trip.findById(flight.trip_id);
            if (trip.isUserAuthorizedToView(req.user)) {
                const flights = yield flight.markAsSelected();
                if (flights.error) {
                    res.status(400).json({ error: flights.error });
                }
                res.json(filterFlightGroupData(flights));
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
