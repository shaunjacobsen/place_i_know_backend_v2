const express = require('express');
const models = require('./../../models');

const { authenticate, permit } = require('./../../middleware/authenticate');
const { filterAccommodationGroupData } = require('./../../functions/accommodationGroup');
const { filterFlightGroupData } = require('./../../functions/flightGroup');
const { filterTrainGroupData } = require('./../../functions/trainGroup');

const flattenArray = arr => {
  return arr.reduce((a, b) => {
    return a.concat(b);
  });
};

module.exports = app => {
  app.get('/trip', authenticate, permit('user', 'admin'), async (req, res) => {
    let trips = await models.trip.findByUser(req.user.profile_id);
    res.json(trips);
  });

  app.get(
    '/trip/:tripId/itineraries',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let trip = await models.trip.findById(req.params.tripId);
        if (await trip.isUserAuthorizedToView(req.user)) {
          let itineraries = await models.itinerary.findAll({
            where: { trip_id: trip.trip_id },
          });
          res.json(itineraries);
        }
        res.status(401).send();
      } catch (e) {
        res.status(400).json(e);
      }
    }
  );

  app.get(
    '/trip/:tripId/places',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let trip = await models.trip.findById(req.params.tripId);
        if (await trip.isUserAuthorizedToView(req.user)) {
          let itinerary = await models.itinerary.findOne({
            where: { trip_id: trip.trip_id },
          });
          let eventPlaces = await itinerary.getListOfEventPlaces();
          let accommodationPlaces = await trip.getListOfAccommodationPlaces();
          let flightPlaces = await trip.getListOfFlightPlaces();
          let trainPlaces = await trip.getListOfTrainPlaces();
          let concatenatedPlaceIds = eventPlaces.concat(
            accommodationPlaces,
            flattenArray(flightPlaces),
            flattenArray(trainPlaces)
          );

          let placesList = await models.place.findAll({
            where: { place_id: { $in: concatenatedPlaceIds } },
            include: {
              model: models.image,
              attributes: ['secure_url'],
            },
          });
          res.json(placesList);
        } else {
          res.status(401).send();
        }
      } catch (error) {
        res.status(400).json(error);
      }
    }
  );

  app.get(
    '/trip/:tripId/accommodation_groups',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let trip = await models.trip.findById(req.params.tripId);
        if (await trip.isUserAuthorizedToView(req.user)) {
          let accommodationGroups = await trip.getListOfAccommodationGroups();
          const data = filterAccommodationGroupData(accommodationGroups);
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
    '/trip/:tripId/accommodations',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let trip = await models.trip.findById(req.params.tripId);
        if (await trip.isUserAuthorizedToView(req.user)) {
          let accommodations = await trip.getListOfAccommodations();
          res.json(accommodations);
        } else {
          res.status(401).send();
        }
      } catch (error) {
        res.status(400).json(error);
      }
    }
  );

  app.get(
    '/trip/:tripId/flight_groups',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let trip = await models.trip.findById(req.params.tripId);
        if (await trip.isUserAuthorizedToView(req.user)) {
          let flightGroups = await trip.getListOfFlightGroups();
          const data = filterFlightGroupData(flightGroups);
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
    '/trip/:tripId/flights',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let trip = await models.trip.findById(req.params.tripId);
        if (await trip.isUserAuthorizedToView(req.user)) {
          let flights = await trip.getListOfFlights();
          res.json(flights);
        } else {
          res.status(401).send();
        }
      } catch (e) {
        res.status(400).json(e);
      }
    }
  );

  app.get(
    '/trip/:tripId/train_groups',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let trip = await models.trip.findById(req.params.tripId);
        if (await trip.isUserAuthorizedToView(req.user)) {
          let trainGroups = await trip.getListOfTrainGroups();
          const data = filterTrainGroupData(trainGroups);
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
    '/trip/:tripId/trains',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let trip = await models.trip.findById(req.params.tripId);
        if (await trip.isUserAuthorizedToView(req.user)) {
          let trains = await trip.getListOfTrains();
          res.json(trains);
        } else {
          res.status(401).send();
        }
      } catch (error) {
        res.status(400).json(error);
      }
    }
  );

  app.get(
    '/trip/:id/attendees',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let trip = await models.trip.findById(req.params.id);
        if (trip.isUserAuthorizedToView(req.user)) {
          const attendees = await trip.listAttendees();
          res.json(attendees);
        } else {
          res.status(401).send();
        }
      } catch (e) {
        res.status(400).json(e);
      }
    }
  );

  app.get(
    '/trip/:tripId/document_groups',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let trip = await models.trip.findById(req.params.tripId);
        if (await trip.isUserAuthorizedToView(req.user)) {
          let documentGroups = await trip.getListOfDocumentGroups();
          res.json(documentGroups);
        } else {
          res.status(401).send();
        }
      } catch (error) {
        res.status(400).json(error);
      }
    }
  );

  app.get('/admin/trip', authenticate, permit('admin'), async (req, res) => {
    try {
      const allTrips = await models.trip.findAll();
      res.json(allTrips);
    } catch (e) {
      res.status(400).send();
    }
  });

  app.get('/admin/trip/:id', authenticate, permit('admin'), async (req, res) => {
    try {
      const trip = await models.trip.findById(req.params.id);
      res.json(trip);
    } catch (e) {
      res.status(400).send();
    }
  });

  app.post('/admin/trip', authenticate, permit('admin'), (req, res) => {
    models.Trip.build({
      title: req.body.title,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      attendees: req.body.attendees,
      created_by: req.user._id,
    })
      .save()
      .then(trip => {
        res.json(trip);
      })
      .catch(e => res.status(400).json({ errors: e.errors }));
  });

  app.patch('/admin/trip/:tripId', authenticate, permit('admin'), (req, res) => {
    models.Trip.findById(req.params.tripId)
      .then(trip => {
        trip
          .update(
            {
              title: req.body.title,
              start_date: req.body.start_date,
              end_date: req.body.end_date,
              attendees: req.body.attendees,
            },
            {
              fields: Object.keys(req.body),
            }
          )
          .then(updatedTrip => {
            res.status(200).json(updatedTrip);
          })
          .catch(e => res.status(400).json({ errors: e }));
      })
      .catch(e => res.status(404).json({ errors: e }));
  });

  app.delete('/admin/trip/:tripId', authenticate, permit('admin'), (req, res) => {
    models.Trip.findById(req.params.tripId)
      .then(trip => {
        trip
          .destroy()
          .then(() => res.status(200).send())
          .catch(e => res.status(400).json({ errors: e }));
      })
      .catch(e => res.status(404).send());
  });
};
