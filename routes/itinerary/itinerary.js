const express = require('express');

const { authenticate, permit } = require('./../../middleware/authenticate');
const { Trip } = require('./../../models/trip');
const { Itinerary } = require('./../../models/itinerary');

module.exports = (app) => {
  app.get('/itinerary/:itineraryId', authenticate, permit('user', 'admin'), async (req, res) => {
    try {
      let itinerary = await Itinerary.findById(req.params.itineraryId);
      if (await itinerary.isUserAuthorizedToView(req.user)) {
        res.json(itinerary);
      } else {
        res.status(401).send();
      }
    } catch (error) {
      res.status(400).json(error);
    }
  });
}