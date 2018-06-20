const express = require('express');
const models = require('./../../models');

const { authenticate, permit } = require('./../../middleware/authenticate');
const { filterTrainGroupData } = require('./../../functions/trainGroup');

module.exports = app => {
  app.post(
    '/train/:id/select',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const train = await models.train.findById(req.params.id);
        const trip = await models.trip.findById(train.trip_id);
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
