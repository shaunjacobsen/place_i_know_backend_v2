const express = require('express');

const { authenticate, permit } = require('./../../middleware/authenticate');
const { User } = require('./../../models/user');

module.exports = (app) => {
  app.get('/user', authenticate, permit('admin', 'user'), (req, res) => {
    res.json(req.user);
  });

  app.post('/signin', async (req, res) => {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
    } catch (error) {
      res.status(400).send();
    }
  });

  app.post('/signout', authenticate, async (req, res) => {
    try {
      await User.invalidateToken(req.token);
      res.status(200).send();
    } catch (error) {
      res.status(400).send();
    }
  });
}