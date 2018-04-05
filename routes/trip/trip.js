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
}