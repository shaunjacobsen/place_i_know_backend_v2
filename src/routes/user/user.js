const express = require('express');
const bcrypt = require('bcrypt');
const models = require('./../../models');
const emailQueue = require('./../../queue/email');

const { authenticate, permit } = require('./../../middleware/authenticate');

const getBaseUserDetails = async userObject => ({
  profileId: userObject.profile_id,
  firstName: userObject.first_name,
  lastName: userObject.last_name,
  email: userObject.email,
  avatar: await userObject.getAvatarUrl(),
  role: userObject.role,
  created: userObject.created,
});

module.exports = app => {
  app.get('/user', authenticate, permit('admin', 'user'), (req, res) => {
    res.json(req.user);
  });

  app.post('/signin', async (req, res) => {
    try {
      const user = await models.user.findByCredentials(req.body.email, req.body.password);
      if (!user) {
        res.status(401).json({ error: 'INCORRECT_CREDENTIALS' });
        return;
      }
      const token = await user.generateAuthToken();
      const userDetails = await getBaseUserDetails(user);
      res.header('x-auth', token).send(userDetails);
    } catch (e) {
      res.status(400).json({ error: 'REQUEST_ERROR' });
    }
  });

  app.get('/token', async (req, res) => {
    try {
      const tokenDetails = await models.session_key.getDetails(req.headers['x-auth']);
      if (tokenDetails.expires > new Date().getTime()) {
        const user = await models.user.findOne({
          where: { profile_id: tokenDetails.user_id },
        });
        const userDetails = await getBaseUserDetails(user);
        res.send(userDetails);
      }
    } catch (e) {
      res.status(401).send();
    }
  });

  app.post('/signout', async (req, res) => {
    try {
      await models.session_key.invalidate(req.body.token);
      res.status(200).send();
    } catch (e) {
      res.status(400).send();
    }
  });

  app.post('/user/forgot_password', async (req, res) => {
    try {
      const user = await models.user.findOne({
        attributes: ['profile_id', 'email', 'first_name'],
        where: { email: req.body.email },
      });
      if (!user) {
        // no matter what, we send a 200 reply
        // to prevent malicious users from finding valid accounts
        res.status(200).send();
      } else if (user) {
        const data = await models.password_reset_token.generateAndSave(user);
        emailQueue.queueEmail({
          subs: { reset_token: data.token, reset_id: data.id },
          template: 'FORGOT_PASSWORD',
          user,
        });
        res.status(200).send();
      }
    } catch (e) {
      res.status(400).send(e);
    }
  });

  app.post('/user/reset_password/:id/:token', async (req, res) => {
    try {
      const tokenRecord = await models.password_reset_token.findById(req.params.id);
      if (tokenRecord.expires < new Date() || tokenRecord.used) {
        res.status(403).json({ error: 'TOKEN_EXPIRED' });
      }
      const isValid = await tokenRecord.isValid(req.params.token);
      if (isValid) {
        const user = await models.user.findById(tokenRecord.user_id);
        user
          .update({
            password: req.body.new_password,
          })
          .then(() => {
            tokenRecord
              .update({
                used: true,
              })
              .then(() => {
                res.status(200).send();
              })
              .catch(() => res.status(400).send());
          })
          .catch(() => res.status(400).send());
      } else {
        res.status(401).json({ error: 'TOKEN_INVALID' });
      }
    } catch (e) {
      res.status(400).send();
    }
  });

  app.patch('/user/:userId', authenticate, permit('user', 'admin'), async (req, res) => {
    const userToUpdate = await models.user.findById(req.params.userId);
    if (userToUpdate.profile_id === req.user._id || req.user.role === 'admin') {
      userToUpdate
        .update(
          {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            postal: req.body.postal,
            country: req.body.country,
            phone: req.body.phone,
            gender: req.body.gender,
            birthdate: req.body.birthdate,
          },
          { fields: Object.keys(req.body) }
        )
        .then(updatedUser => {
          res.status(200).json(updatedUser);
        })
        .catch(e => res.status(400).json({ errors: e }));
    } else {
      res.status(401).send();
    }
  });

  app.post('/user', async (req, res) => {
    const userEmail = req.body.email_address;
    const matches = await models.user.findAll({
      where: {
        email: userEmail,
      },
    });
    if (matches.length > 0) {
      res.json({ status: 'user_exists' });
    } else {
      try {
        models.user
          .build({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email_address.trim().toLowerCase(),
            password: req.body.password,
          })
          .save()
          .then(newUser => {
            if (req.body.create_travel_request) {
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
                .then(async newRequest => {
                  res.status(201).json({
                    status: 'success',
                    user_id: newUser.profile_id,
                    travel_request_id: newRequest.request_id,
                    token: await newUser.generateAuthToken(),
                    first_name: newUser.first_name,
                    avatar:
                      'https://res.cloudinary.com/placeiknow/image/upload/v1507692917/faces/basic.png',
                  });
                });
            } else {
              res.status(201).json({ id: newUser.profile_id });
            }
          });
      } catch (e) {
        res.status(400).send({ error: e.message });
      }
    }
  });
};
