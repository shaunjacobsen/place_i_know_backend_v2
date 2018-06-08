const express = require('express');
const models = require('./../../models');

const { authenticate, permit } = require('./../../middleware/authenticate');

module.exports = app => {
  app.post(
    '/official_document',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const newOfficialDocument = models.official_document.build({
          document_type: req.body.document_type,
          full_name: req.body.full_name,
          identification_number: req.body.identification_number,
          issue_locality: req.body.issue_locality,
          issue_date: req.body.issue_date,
          expiration_date: req.body.expiration_date,
          notes: req.body.notes,
          created: new Date(),
          created_by: req.user._id,
        });
        const record = await newOfficialDocument.save();
        res.json(record.selectiveDecrypt());
      } catch (e) {
        res.status(400).send(e);
      }
    }
  );

  app.patch('/admin/document/:documentId', authenticate, permit('admin'), (req, res) => {
    models.document
      .findById(req.params.documentId)
      .then(doc => {
        doc
          .update(
            {
              title: req.body.title,
              document_group_id: req.body.document_group_id,
              expires: req.body.expires,
              uploaded: req.body.uploaded,
            },
            {
              fields: Object.keys(req.body),
            }
          )
          .then(updatedDocument => {
            res.status(200).json(updatedDocument);
          })
          .catch(e => res.status(400).json({ errors: e }));
      })
      .catch(e => res.status(404).json({ errors: e }));
  });
};
