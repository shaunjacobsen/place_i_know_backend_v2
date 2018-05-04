const express = require('express');

const { authenticate, permit } = require('./../../middleware/authenticate');
const { Accommodation } = require('./../../models/accommodation');
const { Trip } = require('./../../models/trip');

module.exports = app => {
  app.get(
    '/trip/:id/accommodations',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const trip = await Trip.findById(req.params.id);
        if (trip.isUserAuthorizedToView(req.user)) {
          const accommodations = await trip.listAccommodationsWithGroups();
          res.json(accommodations);
        } else {
          res.status(401).send();
        }
      } catch (e) {
        res.status(400).json(e);
      }
    }
  );

  app.post(
    '/accommodation/:id/select',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const accommodation = await Accommodation.findById(req.params.id);
        const trip = await Trip.findById(accommodation.trip_id);
        if (trip.isUserAuthorizedToView(req.user)) {
          const accommodations = await accommodation.markAsSelected();
          if (accommodations.error) {
            res.status(400).json({error: accommodations.error});
          }
          res.json(accommodations);
        } else {
          res.status(401).send();
        }
      } catch (e) {
        res.status(400).json(e);
      }
    }
  );
};
