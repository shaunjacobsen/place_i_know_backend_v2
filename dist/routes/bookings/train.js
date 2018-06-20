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
const { filterTrainGroupData } = require('./../../functions/trainGroup');
module.exports = app => {
    app.post('/train/:id/select', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const train = yield models.train.findById(req.params.id);
            const trip = yield models.trip.findById(train.trip_id);
            if (trip.isUserAuthorizedToView(req.user)) {
                const trains = yield train.markAsSelected();
                if (trains.error) {
                    res.status(400).json({ error: trains.error });
                }
                res.json(filterTrainGroupData(trains));
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
