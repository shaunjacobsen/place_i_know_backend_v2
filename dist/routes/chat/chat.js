var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const axios = require('axios');
const models = require('./../../models');
const { chatkit } = require('./../../external/chat/chatKit');
const { authenticate, permit } = require('./../../middleware/authenticate');
module.exports = app => {
    app.post('/chat/authenticate', authenticate, permit('user', 'admin'), (req, res) => {
        const authData = chatkit.authenticate({ userId: String(req.user._id) });
        res.status(authData.status).send(authData.body);
    });
    app.get('/chat/:userId/rooms', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield chatkit.getUserJoinableRooms({
                userId: req.params.userId,
            });
            res.status(200).json(response);
        }
        catch (e) {
            res.status(e.status).json(e);
        }
    }));
    app.get('/chat/room/:pusherRoomId', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const chatRoom = yield models.chat_room.findOne({
                where: { room_id: req.params.pusherRoomId },
                include: { model: models.chat_message },
            });
            if (yield chatRoom.isUserAuthorizedForRoomActions(req.user)) {
                res.json(chatRoom);
            }
        }
        catch (e) {
            res.status(400).send(e);
        }
    }));
    app.post('/chat/room/:pusherRoomId/message/:messageId/mark_read', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const chatRoom = yield models.chat_room.findOne({
                where: { room_id: req.params.pusherRoomId },
            });
            if (yield chatRoom.isUserAuthorizedForRoomActions(req.user)) {
                const resp = yield chatRoom.setUserReadMessage(req.user._id, req.params.messageId);
                res.json(resp);
            }
        }
        catch (e) {
        }
    }));
    app.post('/chat/room/:pusherRoomId/message', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const chatRoom = yield models.chat_room.findOne({
                where: { room_id: req.params.pusherRoomId },
            });
            if (yield chatRoom.isUserAuthorizedForRoomActions(req.user)) {
                const resp = yield chatRoom.createNewMessage(req.user._id, req.body);
                res.json(resp);
            }
        }
        catch (e) {
        }
    }));
    // users
    app.get('/admin/chat/users', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield chatkit.getUsers();
            res.json(users);
        }
        catch (e) {
            res.status(400).send(e);
        }
    }));
    app.post('/admin/chat/user', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { user_id, full_name, image_url } = req.body;
        try {
            const response = yield chatkit.createUser({
                id: String(user_id),
                name: full_name,
                avatarURL: image_url,
            });
            if (response) {
                res.status(201).json(response);
            }
        }
        catch (e) {
            if (e.error_type === 'services/chatkit/user_already_exists') {
                res.status(200);
            }
            else {
                res.status(e.status).json(e);
            }
        }
    }));
    app.delete('/admin/chat/user/:userId', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield chatkit.deleteUser({
                userId: String(req.params.userId),
            });
            res.status(200).send();
        }
        catch (e) {
            res.status(400).send(e);
        }
    }));
    // rooms
    app.get('/admin/chat/rooms', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield chatkit.createRoom({
                creatorId: creator_id,
                name: name,
            });
            res.status(200);
        }
        catch (e) {
            res.status(400).json(e);
        }
    }));
    app.post('/admin/chat/room', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { creator_id, name, users, private } = req.body;
        try {
            const response = yield chatkit.createRoom({
                creatorId: String(creator_id),
                name: name,
                isPrivate: private,
                userIds: users.map(id => String(id)),
            });
            if (response) {
                res.status(201).json(response);
            }
        }
        catch (e) {
            res.status(400).send(e);
        }
    }));
    app.post('/admin/chat/room', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { creator_id, name, users, private } = req.body;
        try {
            const response = yield chatkit.createRoom({
                creatorId: String(creator_id),
                name: name,
                isPrivate: private,
                userIds: users.map(id => String(id)),
            });
            if (response) {
                res.status(201).json(response);
            }
        }
        catch (e) {
            res.status(400).send(e);
        }
    }));
    app.put('/admin/chat/room/:roomId', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const data = { user_ids: req.body.users.map(userId => String(userId)) };
        const reqUrl = `https://us1.pusherplatform.io/services/chatkit/v1/${process.env.PUSHER_CHATKIT_INSTANCE_ID}/rooms/${req.params.roomId}/users/add`;
        const authorization = chatkit.authenticate({ userId: String(req.user._id) });
        try {
            const response = yield axios.put(reqUrl, data, {
                headers: {
                    Authorization: `Bearer ${authorization.body.access_token}`,
                },
            });
            res.status(response.status).send();
        }
        catch (e) {
            res.status(400).json(e);
        }
    }));
    // roles
    app.get('/admin/chat/roles', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield chatkit.getRoles();
            if (response) {
                res.status(200).json(response);
            }
        }
        catch (e) {
            res.status(e.status).json(e);
        }
    }));
    app.get('/admin/chat/:userId/roles', authenticate, permit('user', 'admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield chatkit.getUserRoles({
                userId: req.params.userId,
            });
            res.status(200).json(response);
        }
        catch (e) {
            res.status(e.status).json(e);
        }
    }));
    app.post('/admin/chat/:userId/global_role', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { role_name } = req.body;
        try {
            yield chatkit.assignGlobalRoleToUser({
                userId: String(req.params.userId),
                roleName: role_name,
            });
            res.status(200).send();
        }
        catch (e) {
            res.status(400).send(e);
        }
    }));
    app.post('/admin/chat/global_role', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { name, permissions } = req.body;
        try {
            const response = yield chatkit.createGlobalRole({
                name,
                permissions,
            });
            if (response) {
                res.status(201).send();
            }
        }
        catch (e) {
            res.status(400).send(e);
        }
    }));
    app.delete('/admin/chat/global_role/:globalRoleName', authenticate, permit('admin'), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield chatkit.deleteGlobalRole({
                name: req.params.globalRoleName,
            });
            res.status(200).send();
        }
        catch (e) {
            res.status(400).send(e);
        }
    }));
};
