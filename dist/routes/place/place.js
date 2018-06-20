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
const { authenticate, permit } = require('./../../middleware/authenticate');
module.exports = app => {
    app.get('/place/:placeId', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let place = yield models.Place.findById(req.params.placeId, {
                include: [
                    {
                        model: models.Image,
                        attributes: ['secure_url'],
                    },
                ],
            });
            res.json(place);
        }
        catch (error) {
            console.log(error);
            res.status(400).send();
        }
    }));
    app.post('/admin/place', authenticate, permit('admin'), (req, res) => {
        models.place.build({
            type: req.body.type,
            name: req.body.name,
            full_address: req.body.full_address,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            postal: req.body.postal,
            country: req.body.country,
            phone: req.body.phone,
            website: req.body.website,
            google_id: req.body.google_id,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            tags: req.body.tags,
            place_attributes: req.body.attributes,
            notes: req.body.notes,
            hours: req.body.hours,
            image_id: req.body.image_id,
            created_by: req.user._id,
        })
            .save()
            .then(place => {
            res.json(place);
        })
            .catch(e => res.status(400).json({ errors: e }));
    });
    app.patch('/admin/place/:placeId', authenticate, permit('admin'), (req, res) => {
        models.place.findById(req.params.placeId)
            .then(place => {
            place
                .update({
                type: req.body.type,
                name: req.body.name,
                full_address: req.body.full_address,
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                postal: req.body.postal,
                country: req.body.country,
                phone: req.body.phone,
                website: req.body.website,
                google_id: req.body.google_id,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                tags: req.body.tags,
                place_attributes: req.body.attributes,
                notes: req.body.notes,
                hours: req.body.hours,
                image_id: req.body.image_id,
            }, {
                fields: Object.keys(req.body),
            })
                .then(updatedPlace => {
                res.status(200).json(updatedPlace);
            })
                .catch(e => res.status(400).json({ errors: e }));
        })
            .catch(e => res.status(404).json({ errors: e }));
    });
    app.delete('/admin/place/:placeId', authenticate, permit('admin'), (req, res) => {
        models.place.findById(req.params.placeId)
            .then(place => {
            place
                .destroy()
                .then(() => res.status(200).send())
                .catch(e => res.status(400).json({ errors: e }));
        })
            .catch(e => res.status(404).send());
    });
};
