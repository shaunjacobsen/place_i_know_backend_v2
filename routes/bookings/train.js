const express = require('express');

const { authenticate, permit } = require('./../../middleware/authenticate');
const { Train } = require('./../../models/train');
const { Trip } = require('./../../models/trip');
const { filterTrainGroupData } = require('./../../functions/trainGroup');

module.exports = app => {
  app.post(
    '/train/:id/select',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const train = await Train.findById(req.params.id);
        const trip = await Trip.findById(train.trip_id);
        if (trip.isUserAuthorizedToView(req.user)) {
          const trains = await train.markAsSelected();
          if (trains.error) {
            res.status(400).json({ error: trains.error });
          }
          res.json(filterTrainGroupData(trains));
        } else {
          res.status(401).send();
        }
      } catch (e) {
        res.status(400).json(e);
      }
    }
  );
};
