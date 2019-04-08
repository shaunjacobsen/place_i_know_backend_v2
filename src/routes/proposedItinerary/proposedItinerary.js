const models = require('./../../models');

const { authenticate, permit } = require('./../../middleware/authenticate');

module.exports = app => {
  app.get(
    '/trip/:tripId/proposed_itineraries',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const trip = await models.trip.findById(req.params.tripId);
        const itineraries = await models.proposed_itinerary.findAll({
          where: { trip_id: req.params.tripId },
          include: {
            model: models.proposed_itinerary_day,
          },
        });
        if (trip.isUserAuthorizedToView(req.user)) {
          res.json(itineraries);
        } else {
          res.status(401).send();
        }
      } catch (e) {
        res.status(400).json(e);
      }
    }
  );
  // app.post(
  //   '/flight/:id/select',
  //   authenticate,
  //   permit('user', 'admin'),
  //   async (req, res) => {
  //     try {
  //       const flight = await models.flight.findById(req.params.id);
  //       const trip = await models.trip.findById(flight.trip_id);
  //       if (trip.isUserAuthorizedToView(req.user)) {
  //         const flights = await flight.markAsSelected();
  //         if (flights.error) {
  //           res.status(400).json({ error: flights.error });
  //         }
  //         res.json(filterFlightGroupData(flights));
  //       } else {
  //         res.status(401).send();
  //       }
  //     } catch (e) {
  //       res.status(400).json(e);
  //     }
  //   }
  // );
};
