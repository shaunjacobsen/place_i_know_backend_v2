const express = require('express');

const { authenticate } = require('./../../middleware/authenticate');
const { User } = require('./../../models/user');

module.exports = (app) => {
  app.get('/users', authenticate, async (req, res) => {
    try {
      let response = await User.findAll();
      res.json(response);
    } catch (error) {
     console.log(error); 
    }
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
}