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
});

module.exports = app => {
  app.get('/user', authenticate, permit('admin', 'user'), (req, res) => {
    res.json(req.user);
  });

  app.post('/signin', async (req, res) => {
    try {
      const user = await models.user.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      const userDetails = await getBaseUserDetails(user);
      res.header('x-auth', token).send(userDetails);
    } catch (e) {
      res.status(400).send(e.message);
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
          .then(() => res.status(200).send())
          .catch(() => res.status(400).send());
      } else {
        res.status(401).json({ error: 'TOKEN_INVALID' });
      }
    } catch (e) {
      res.status(400).send();
    }
  });
};
