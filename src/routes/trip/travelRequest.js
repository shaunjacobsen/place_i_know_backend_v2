const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const models = require('./../../models');

const { authenticate, permit } = require('./../../middleware/authenticate');

module.exports = app => {
  app.post('/travel_request', authenticate, permit('user', 'admin'), async (req, res) => {
    try {
      models.travel_request
        .build({
          user_id: newUser.profile_id,
          destinations: req.body.destination,
          traveler_type: req.body.whos_traveling,
          num_travelers: req.body.total_travelers,
          num_adults: req.body.total_adults,
          num_children: req.body.total_children,
          created_at: new Date(),
        })
        .save()
        .then(newRequest => {
          res.json({
            new_request_id: newRequest.request_id,
          });
        })
        .catch(e => res.status(400).json({ error: e.message }));
    } catch (e) {
      res.status(400);
    }
  });

  app.post(
    '/travel_request/2',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const currentRequest = await models.travel_request.findById(
          req.body.travel_request_id
        );
        if (currentRequest.user_id !== req.user._id) {
          res.status(401).send();
        } else {
          currentRequest.trip_start_date = req.body.trip_start_date;
          currentRequest.trip_end_date = req.body.trip_end_date;
          currentRequest.duration_of_trip = req.body.duration_of_trip;
          currentRequest
            .save()
            .then(() => res.status(200).send())
            .catch(e => res.status(400).json({ error: e.message }));
        }
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    }
  );

  app.post(
    '/travel_request/3',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const currentRequest = await models.travel_request.findById(
          req.body.travel_request_id
        );
        if (currentRequest.user_id !== req.user._id) {
          res.status(401).send();
        } else {
          currentRequest.interests = JSON.stringify(req.body.data);
          currentRequest
            .save()
            .then(() => res.status(200).send())
            .catch(e => res.status(400).json({ error: e.message }));
        }
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    }
  );

  app.post(
    '/travel_request/4',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const currentRequest = await models.travel_request.findById(
          req.body.travel_request_id
        );
        if (currentRequest.user_id !== req.user._id) {
          res.status(401).send();
        } else {
          currentRequest.needs_flights = req.body.needs_flights;
          currentRequest.departure_airport = req.body.departure_airport;
          currentRequest.secondary_departure_airport =
            req.body.secondary_departure_airport;
          currentRequest.needs_hotels = req.body.needs_hotels;
          currentRequest.star_rating = req.body.star_rating;
          currentRequest.hotel_budget = req.body.hotel_budget || 0;
          currentRequest.additional_info = req.body.additional_info;
          currentRequest
            .save()
            .then(() => res.status(200).send())
            .catch(e => res.status(400).json({ error: e.message }));
        }
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    }
  );

  app.post(
    '/travel_request/charge',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const currentRequest = await models.travel_request.findById(
          req.body.travel_request_id
        );
        if (currentRequest.user_id !== req.user._id) {
          res.status(401).send();
        } else {
          stripe.charges.create(
            {
              amount: req.body.amount * 100,
              currency: 'USD',
              receipt_email: req.user.email,
              metadata: {
                travel_request_id: currentRequest.request_id,
              },
            },
            (err, charge) => {
              if (err) {
                res.status(400).json({ error: err });
              } else {
                currentRequest.deposit = req.body.amount;
                currentRequest.total_cost = req.body.amount * 2;
                if (charge.captured) {
                  currentRequest.paid = true;
                }
                currentRequest.paid_at = new Date();
                currentRequest.stripe_charge_id = charge.id;
                currentRequest
                  .save()
                  .then(() => res.status(200).send())
                  .catch(e => res.status(400).json({ error: e.message }));
              }
            }
          );
        }
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    }
  );
};

// token = params['token']
//     amount = params['amount'].to_i
//     amount = amount * 100 # amount should be in cents
//     travel_request_id = params['travel_request_id']
//     user_id = @storage.lookup_user_for_travel_request(travel_request_id)
//     if !user_id.nil?
//       user = User.new(user_id)
//       email = user.info[:email]
//       resp = ChargeCustomer.new.create(token, amount, email, "USD", "Place I Know Travel Planning Deposit")
//       data = {
//         stripe_charge_id: resp[:id],
//         total_cost: (amount / 100) * 2,
//         deposit: amount / 100,
//         payment_date: Time.now
//       }
//       @storage.update_travel_request_payment(travel_request_id, data)
