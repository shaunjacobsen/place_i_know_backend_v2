const express = require('express');

const { authenticate } = require('./../../middleware/authenticate');
const { Trip } = require('./../../models/trip');

module.exports = (app) => {
  app.get('/trip', authenticate, async (req, res) => {
    let trips = await Trip.findByUser(req.user.profile_id);
    res.json(trips);
  });
}