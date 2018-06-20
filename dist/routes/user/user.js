var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const bcrypt = require('bcrypt');
const models = require('./../../models');
const emailQueue = require('./../../queue/email');
const { authenticate, permit } = require('./../../middleware/authenticate');
const getBaseUserDetails = (userObject) => __awaiter(this, void 0, void 0, function* () {
    return ({
        profileId: userObject.profile_id,
        firstName: userObject.first_name,
        lastName: userObject.last_name,
        email: userObject.email,
        avatar: yield userObject.getAvatarUrl(),
        role: userObject.role,
        created: userObject.created,
    });
});
module.exports = app => {
    app.get('/user', authenticate, permit('admin', 'user'), (req, res) => {
        res.json(req.user);
    });
    app.post('/signin', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield models.user.findByCredentials(req.body.email, req.body.password);
            if (!user) {
                res.status(401).json({ error: 'INCORRECT_CREDENTIALS' });
            }
            const token = yield user.generateAuthToken();
            const userDetails = yield getBaseUserDetails(user);
            res.header('x-auth', token).send(userDetails);
        }
        catch (e) {
            res.status(400).json({ error: 'REQUEST_ERROR' });
        }
    }));
    app.get('/token', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenDetails = yield models.session_key.getDetails(req.headers['x-auth']);
            if (tokenDetails.expires > new Date().getTime()) {
                const user = yield models.user.findOne({
                    where: { profile_id: tokenDetails.user_id },
                });
                const userDetails = yield getBaseUserDetails(user);
                res.send(userDetails);
            }
        }
        catch (e) {
            res.status(401).send();
        }
    }));
    app.post('/signout', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield models.session_key.invalidate(req.body.token);
            res.status(200).send();
        }
        catch (e) {
            res.status(400).send();
        }
    }));
    app.post('/user/forgot_password', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield models.user.findOne({
                attributes: ['profile_id', 'email', 'first_name'],
                where: { email: req.body.email },
            });
            if (!user) {
                // no matter what, we send a 200 reply
                // to prevent malicious users from finding valid accounts
                res.status(200).send();
            }
            else if (user) {
                const data = yield models.password_reset_token.generateAndSave(user);
                emailQueue.queueEmail({
                    subs: { reset_token: data.token, reset_id: data.id },
                    template: 'FORGOT_PASSWORD',
                    user,
                });
                res.status(200).send();
            }
        }
        catch (e) {
            res.status(400).send(e);
        }
    }));
    app.post('/user/reset_password/:id/:token', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenRecord = yield models.password_reset_token.findById(req.params.id);
            if (tokenRecord.expires < new Date() || tokenRecord.used) {
                res.status(403).json({ error: 'TOKEN_EXPIRED' });
            }
            const isValid = yield tokenRecord.isValid(req.params.token);
            if (isValid) {
                const user = yield models.user.findById(tokenRecord.user_id);
                user
                    .update({
                    password: req.body.new_password,
                })
                    .then(() => {
                    tokenRecord
                        .update({
                        used: true,
                    })
                        .then(() => {
                        res.status(200).send();
                    })
                        .catch(() => res.status(400).send());
                })
                    .catch(() => res.status(400).send());
            }
            else {
                res.status(401).json({ error: 'TOKEN_INVALID' });
            }
        }
        catch (e) {
            res.status(400).send();
        }
    }));
    app.patch('/user/:userId', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const userToUpdate = yield models.user.findById(req.params.userId);
        if (userToUpdate.profile_id === req.user._id || req.user.role === 'admin') {
            userToUpdate
                .update({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                postal: req.body.postal,
                country: req.body.country,
                phone: req.body.phone,
                gender: req.body.gender,
                birthdate: req.body.birthdate,
            }, { fields: Object.keys(req.body) })
                .then(updatedUser => {
                res.status(200).json(updatedUser);
            })
                .catch(e => res.status(400).json({ errors: e }));
        }
        else {
            res.status(401).send();
        }
    }));
};
