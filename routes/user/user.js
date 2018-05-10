const express = require('express');
const models = require('./../../models');

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
      const user = await models.User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      const userDetails = await getBaseUserDetails(user);
      res.header('x-auth', token).send(userDetails);
    } catch (e) {
      res.status(400).send();
    }
  });

  app.get('/token', async (req, res) => {
    try {
      const tokenDetails = await models.SessionKey.getDetails(req.headers['x-auth']);
      if (tokenDetails.expires > new Date().getTime()) {
        const user = await models.User.findOne({ where: { profile_id: tokenDetails.user_id } });
        const userDetails = await getBaseUserDetails(user);
        res.send(userDetails);
      }
    } catch (e) {
      res.status(401).send();
    }
  });

  app.post('/signout', async (req, res) => {
    try {
      await models.SessionKey.invalidate(req.body.token);
      res.status(200).send();
    } catch (error) {
      res.status(400).send();
    }
  });
};
