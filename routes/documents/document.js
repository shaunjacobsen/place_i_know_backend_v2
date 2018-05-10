const express = require('express');
const models = require('./../../models');
const s3 = require('./../../functions/s3');

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

  app.get('/admin/document/upload', authenticate, permit('admin'), async (req, res) => {
    const fileName = req.query.filename;
    const fileType = fileName.split('.').pop();
    try {
      const uploadUrl = await s3.getSignedUploadUrl(fileName, fileType);
      res.json(uploadUrl);
    } catch (e) {
      res.status(400).send(e);
    }
  });

};
