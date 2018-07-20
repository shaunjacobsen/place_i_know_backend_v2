const express = require('express');
const models = require('./../../models');

const { authenticate, permit } = require('./../../middleware/authenticate');
const { reduceDaysToArray } = require('./../../functions/itinerary');

module.exports = app => {
  app.get(
    '/itinerary/:itineraryId',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let itinerary = await models.itinerary.findById(req.params.itineraryId);
        if (await itinerary.isUserAuthorizedToView(req.user)) {
          let data = {
            trip_id: itinerary.trip_id,
            itinerary_id: itinerary.itinerary_id,
            start_date: itinerary.start_date,
            end_date: itinerary.end_date,
            days: reduceDaysToArray(await itinerary.getListOfDays()),
          };
          res.json(data);
        } else {
          res.status(401).send();
        }
      } catch (error) {
        res.status(400).json(error);
      }
    }
  );

  app.get('/itineraries', authenticate, permit('user', 'admin'), async (req, res) => {
    try {
      let user = await models.user.findById(req.user._id);
      let trips = await models.trip.findByUser(user.profile_id);
      let tripIds = trips.map(trip => trip.trip_id);
      let itineraries = await models.itinerary.findAll({
        where: {
          trip_id: {
            $in: tripIds,
          },
        },
      });
      res.json(itineraries);
    } catch (e) {}
  });

  app.get(
    '/itinerary/:itineraryId/days',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let itinerary = await models.itinerary.findById(req.params.itineraryId);
        if (await itinerary.isUserAuthorizedToView(req.user)) {
          let data = await models.day.findAll({
            where: { itinerary_id: itinerary.itinerary_id },
          });
          res.json(data);
        } else {
          res.status(401).send();
        }
      } catch (error) {
        res.status(400).json(error);
      }
    }
  );

  app.get(
    '/itinerary/:itineraryId/dates',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let itinerary = await models.Itinerary.findById(req.params.itineraryId);
        if (await itinerary.isUserAuthorizedToView(req.user)) {
          const events = await itinerary.getDateRangeOfItineraryEvents();
          const data = events.map(event => {
            return event.date;
          });
          res.json(data);
        } else {
          res.status(401).send();
        }
      } catch (error) {
        res.status(400).json(error);
      }
    }
  );

  app.get(
    '/itinerary/:itineraryId/events',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let itinerary = await models.itinerary.findById(req.params.itineraryId);
        if (await itinerary.isUserAuthorizedToView(req.user)) {
          if (req.query.verbose === 'true') {
            const events = await itinerary.getVerboseListOfEvents();
            res.json(events);
          } else {
            const events = await itinerary.getListOfEvents();
            res.json(events);
          }
        } else {
          res.status(401).send();
        }
      } catch (error) {
        res.status(400).json(error);
      }
    }
  );

  app.post('/admin/itinerary', authenticate, permit('admin'), (req, res) => {
    models.Itinerary.build({
      trip_id: req.body.trip_id,
      title: req.body.title,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      itineraryAttributes: req.body.attributes,
      status: req.body.status,
      created_by: req.user._id,
    })
      .save()
      .then(itinerary => {
        res.json(itinerary);
      })
      .catch(e => res.status(400).json({ errors: e }));
  });

  app.patch(
    '/admin/itinerary/:itineraryId',
    authenticate,
    permit('admin'),
    (req, res) => {
      models.Itinerary.findById(req.params.itineraryId)
        .then(itinerary => {
          itinerary
            .update(
              {
                trip_id: req.body.trip_id,
                title: req.body.title,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                itineraryAttributes: req.body.attributes,
                status: req.body.status,
              },
              {
                fields: Object.keys(req.body),
              }
            )
            .then(updatedItinerary => {
              res.status(200).json(updatedItinerary);
            })
            .catch(e => res.status(400).json({ errors: e }));
        })
        .catch(e => res.status(404).json({ errors: e }));
    }
  );

  app.delete(
    '/admin/itinerary/:itineraryId',
    authenticate,
    permit('admin'),
    (req, res) => {
      models.Itinerary.findById(req.params.itineraryId)
        .then(itinerary => {
          itinerary
            .destroy()
            .then(() => res.status(200).send())
            .catch(e => res.status(400).json({ errors: e }));
        })
        .catch(e => res.status(404).send());
    }
  );
};
