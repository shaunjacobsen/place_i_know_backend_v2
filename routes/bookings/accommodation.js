const express = require('express');
const models = require('./../../models');

const { authenticate, permit } = require('./../../middleware/authenticate');
const { filterAccommodationGroupData } = require('./../../functions/accommodationGroup');

module.exports = app => {
  app.get(
    '/accommodation/:id',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const accommodation = await models.accommodation.findById(req.params.id);
        const trip = await models.trip.findById(accommodation.trip_id);
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
          }
          res.json(data);
        } else {
          res.status(401).send();
        }
      } catch (e) {
        res.status(400).send(e);
      }
    }
  );
  
  app.post(
    '/accommodation/:id/select',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const accommodation = await models.accommodation.findById(req.params.id);
        const trip = await models.trip.findById(accommodation.trip_id);
        if (trip.isUserAuthorizedToView(req.user)) {
          const accommodations = await accommodation.markAsSelected();
          if (accommodations.error) {
            res.status(400).json({ error: accommodations.error });
          }
          res.json(filterAccommodationGroupData(accommodations));
        } else {
          res.status(401).send();
        }
      } catch (e) {
        res.status(400).json(e);
      }
    }
  );
};
