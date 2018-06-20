const express = require('express');
const models = require('./../../models');
const { authenticate, permit } = require('./../../middleware/authenticate');
module.exports = app => {
    app.post('/user_location', authenticate, permit('user', 'admin'), (req, res) => {
        models.user_location
            .build({
            user_id: req.user._id,
            type: req.body.type,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            altitude: req.body.altitude,
            precision: req.body.precision,
            heading: req.body.heading,
            timestamp: new Date().toUTCString,
        })
            .save()
            .then(location => {
            res.json(location);
        })
            .catch(e => res.status(400).json({ errors: e }));
    });
};
