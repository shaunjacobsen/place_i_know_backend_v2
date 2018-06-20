var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const models = require('./../../models');
const s3 = require('./../../functions/s3');
const { authenticate, permit } = require('./../../middleware/authenticate');
module.exports = app => {
    app.get('/document/:id/download', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let doc = yield models.document.findById(req.params.id);
            if (doc.isUserAuthorizedToDownload(req.user)) {
                const downloadData = yield s3.getSignedDownloadUrl(doc);
                res.json({
                    download_url: downloadData.signedUrl,
                });
            }
            else {
                res.status(401).send();
            }
        }
        catch (e) {
            res.status(400).json(e);
        }
    }));
    app.post('/admin/document/upload', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const newDocument = yield models.document.createNew(req.body, req.user);
            const uploadUrl = yield s3.getSignedUploadUrl(encodeURIComponent(newDocument.s3_object), req.body.file_type);
            res.json({
                upload: uploadUrl,
                document: newDocument,
            });
        }
        catch (e) {
            res.status(400).send(e);
        }
    }));
    app.patch('/admin/document/:documentId', authenticate, permit('admin'), (req, res) => {
        models.document
            .findById(req.params.documentId)
            .then(doc => {
            doc
                .update({
                title: req.body.title,
                document_group_id: req.body.document_group_id,
                expires: req.body.expires,
                uploaded: req.body.uploaded,
            }, {
                fields: Object.keys(req.body),
            })
                .then(updatedDocument => {
                res.status(200).json(updatedDocument);
            })
                .catch(e => res.status(400).json({ errors: e }));
        })
            .catch(e => res.status(404).json({ errors: e }));
    });
};
