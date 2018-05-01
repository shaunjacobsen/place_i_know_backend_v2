const express = require('express');

const { authenticate, permit } = require('./../../middleware/authenticate');
const { Trip } = require('./../../models/trip');

module.exports = (app) => {
  app.get('/trip', authenticate, permit('user', 'admin'), async (req, res) => {
    let trips = await Trip.findByUser(req.user.profile_id);
    res.json(trips);
  });

  app.post('/admin/trip', authenticate, permit('admin'), (req, res) => {
    Trip
    .build({
      title: req.body.title,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      attendees: req.body.attendees,
      created_by: req.user._id
    })
    .save()
    .then((trip) => {
      res.json(trip);
    })
    .catch(e => res.status(400).json({ errors: e.errors }));
  });

  app.patch('/admin/trip/:tripId', authenticate, permit('admin'), (req, res) => {
    Trip
    .findById(req.params.tripId)
    .then((trip) => {
      trip.update({
        title: req.body.title,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        attendees: req.body.attendees,
      },{ 
        fields: Object.keys(req.body)
      }).then((updatedTrip) => {
        res.status(200).json(updatedTrip);
      }).catch((e) => res.status(400).json({ errors: e }));
    })
    .catch((e) => res.status(404).json({ errors: e }));
  });

  app.delete('/admin/trip/:tripId', authenticate, permit('admin'), (req, res) => {
    Trip
    .findById(req.params.tripId)
    .then((trip) => {
      trip
      .destroy()
      .then(() => res.status(200).send())
      .catch((e) => res.status(400).json({ errors: e }));
    })
    .catch((e) => res.status(404).send());
  });

  app.get('/trip/:id/attendees', authenticate, permit('user', 'admin'), async (req, res) => {
    try {
      let trip = await Trip.findById(req.params.id);
      if (trip.isUserAuthorizedToView(req.user)) {
        const attendees = await trip.listAttendees();
        res.json(attendees);
      } else {
        res.status(401).send();
      }
    } catch (e) {
      res.status(400).json(error);
    }
  });
}