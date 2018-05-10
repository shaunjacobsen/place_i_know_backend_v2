const express = require('express');
const models = require('./../../models');

const { authenticate, permit } = require('./../../middleware/authenticate');

module.exports = app => {
  app.get(
    '/document/:id/download',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        let doc = await models.document.findById(req.params.id);
        if (doc.isUserAuthorizedToDownload(req.user)) {
          //const downloadUrl = await doc.getSignedS3Url();
          const downloadUrl = 'yes';
          res.json({
            download_url: downloadUrl,
          });
        } else {
          res.status(401).send();
        }
      } catch (e) {
        res.status(400).json(e);
      }
    }
  );
};
