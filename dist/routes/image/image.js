var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');
const models = require('./../../models');
const { cloudinary } = require('./../../external/image/cloudinary');
const { determineFolder, assignImage } = require('./../../functions/image');
const imageQueue = require('./../../queue/image');
const chatQueue = require('./../../queue/chat');
const diskStorage = multer.diskStorage({
    destination: path.join(__basedir, '/public/images'),
    filename: (req, file, done) => {
        done(null, `tmp-${uuid()}`);
    },
});
const upload = multer({ storage: diskStorage, limits: { fileSize: 3145728 } });
const { authenticate, permit } = require('./../../middleware/authenticate');
module.exports = app => {
    app.get('/image/sign_upload', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            res.json(place);
        }
        catch (error) {
            console.log(error);
            res.status(400).send();
        }
    }));
    app.post('/image/upload_initial', authenticate, permit('user', 'admin'), upload.single('avatar'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield cloudinary.v2.uploader.upload(req.file.path, {
                resource_type: 'image',
                public_id: `temp/${req.file.filename}`,
                async: true,
                upload_preset: 'ogtij21s',
            }, (error, result) => {
                if (error) {
                    res.status(400).send(error);
                }
                res.json({ url: result.secure_url, public_id: result.public_id });
            });
        }
        catch (e) {
            res.send(400);
        }
    }));
    app.post('/image/upload_final', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield cloudinary.v2.uploader.upload(req.body.image, {
                resource_type: 'image',
                folder: determineFolder(req.body.type),
                async: true,
                upload_preset: 'final-avatar',
            }, (error, result) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    res.status(400).send(error);
                }
                const assign = yield assignImage(req.body.type, {
                    metaData: {
                        userId: req.user._id,
                    },
                    imageData: {
                        imageUrl: result.url,
                        secureImageUrl: result.secure_url,
                        publicId: result.public_id,
                        format: result.format,
                        created: result.created_at,
                    },
                });
                imageQueue.queueImageDeletion({
                    function: 'REMOVE_CLOUDINARY_IMAGE',
                    cloudinaryPublicId: req.body.delete,
                });
                if (assign) {
                    res.status(201).json({
                        new_image_url: result.secure_url,
                    });
                }
            }));
        }
        catch (e) {
            res.send(400);
        }
    }));
};
