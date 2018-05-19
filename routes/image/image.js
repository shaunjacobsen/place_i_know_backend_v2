const express = require('express');
const multer = require('multer');
const models = require('./../../models');
const { cloudinary } = require('./../../external/image/cloudinary');

const upload = multer({ dest: 'files/' });

const { authenticate, permit } = require('./../../middleware/authenticate');

module.exports = app => {
  app.get(
    '/image/sign_upload',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        res.json(place);
      } catch (error) {
        console.log(error);
        res.status(400).send();
      }
    }
  );

  app.post(
    '/image/upload_initial',
    authenticate,
    permit('user', 'admin'), upload.single('avatar'),
    async (req, res) => {
      try {
        console.log(req.files);
      } catch (e) {}
    }
  );
};
