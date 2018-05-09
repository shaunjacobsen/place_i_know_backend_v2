const express = require('express');

const { authenticate, permit } = require('./../../middleware/authenticate');
const { Flight } = require('./../../models/flight');
const { Trip } = require('./../../models/trip');
const { filterFlightGroupData } = require('./../../functions/flightGroup');

module.exports = app => {
  app.post(
    '/flight/:id/select',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const flight = await Flight.findById(req.params.id);
        const trip = await Trip.findById(flight.trip_id);
        if (trip.isUserAuthorizedToView(req.user)) {
          const flights = await flight.markAsSelected();
          if (flights.error) {
            res.status(400).json({ error: flights.error });
          }
          res.json(filterFlightGroupData(flights));
        } else {
          res.status(401).send();
        }
      } catch (e) {
        res.status(400).json(e);
      }
    }
  );
};
