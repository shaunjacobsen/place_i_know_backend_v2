const express = require('express');
const models = require('./../../models');

const { authenticate, permit } = require('./../../middleware/authenticate');

module.exports = app => {
  app.post('/rate', authenticate, permit('user', 'admin'), async (req, res) => {
    try {
      const ratingObjects = req.body;
      let updates = [];
      Object.keys(ratingObjects).forEach(eventId => {
        const ratingData = ratingObjects[eventId];
        updates.push(
          models.event_rating.upsert({
            event_id: eventId,
            user_id: req.user._id,
            rating: ratingData.rating,
            comments: ratingData.comments,
            time_spent: ratingData.time_spent,
            price_accurate: ratingData.price_accurate,
            price_notes: ratingData.price_notes,
            app_link_id: ratingData.rating_link_id,
            updated_date: new Date(),
          })
        );
      });
      Promise.all(updates)
        .then(res.status(200))
        .catch(e => res.status(400).json({ error: e.message }));
    } catch (error) {
      res.status(400).json(error);
    }
  });
};
