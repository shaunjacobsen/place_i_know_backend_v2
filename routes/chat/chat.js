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

  app.get(
    '/chat/:userId/rooms',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const response = await chatkit.getUserJoinableRooms({
          userId: req.params.userId,
        });
        res.status(200).json(response);
      } catch (e) {
        res.status(e.status).json(e);
      }
    }
  );

  app.get(
    '/chat/room/:pusherRoomId',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const chatRoom = await models.chat_room.findOne({
          where: { room_id: req.params.pusherRoomId },
          include: { model: models.chat_message },
        });
        if (await chatRoom.isUserAuthorizedForRoomActions(req.user)) {
          res.json(chatRoom);
        }
      } catch (e) {
        res.status(400).send(e);
      }
    }
  );

  app.post(
    '/chat/room/:pusherRoomId/message/:messageId/markRead',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const chatRoom = await models.chat_room.findOne({
          where: { room_id: req.params.pusherRoomId },
        });
        if (await chatRoom.isUserAuthorizedForRoomActions(req.user)) {
          const resp = await chatRoom.setUserReadMessage(req.user._id, req.params.messageId);
          res.json(resp);
        }
      } catch (e) {

      }
    }
  );

  app.post(
    '/chat/room/:pusherRoomId/message',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const chatRoom = await models.chat_room.findOne({
          where: { room_id: req.params.pusherRoomId },
        });
        if (await chatRoom.isUserAuthorizedForRoomActions(req.user)) {
          const resp = await chatRoom.createNewMessage(req.user._id, req.body);
          res.json(resp);
        }
      } catch (e) {

      }
    }
  );

  // users

  app.get('/admin/chat/users', authenticate, permit('admin'), async (req, res) => {
    try {
      const users = await chatkit.getUsers();
      res.json(users);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  app.post('/admin/chat/user', authenticate, permit('admin'), async (req, res) => {
    const { user_id, full_name, image_url } = req.body;
    try {
      const response = await chatkit.createUser({
        id: String(user_id),
        name: full_name,
        avatarURL: image_url,
      });
      if (response) {
        res.status(201).json(response);
      }
    } catch (e) {
      if (e.error_type === 'services/chatkit/user_already_exists') {
        res.status(200);
      } else {
        res.status(e.status).json(e);
      }
    }
  });

  app.delete(
    '/admin/chat/user/:userId',
    authenticate,
    permit('admin'),
    async (req, res) => {
      try {
        await chatkit.deleteUser({
          userId: String(req.params.userId),
        });
        res.status(200).send();
      } catch (e) {
        res.status(400).send(e);
      }
    }
  );

  // rooms

  app.get('/admin/chat/rooms', authenticate, permit('admin'), async (req, res) => {
    try {
      await chatkit.createRoom({
        creatorId: creator_id,
        name: name,
      });
      res.status(200);
    } catch (e) {
      res.status(400).json(e);
    }
  });

  app.post('/admin/chat/room', authenticate, permit('admin'), async (req, res) => {
    let { creator_id, name, users, private } = req.body;
    try {
      const response = await chatkit.createRoom({
        creatorId: String(creator_id),
        name: name,
        isPrivate: private,
        userIds: users.map(id => String(id)),
      });
      if (response) {
        res.status(201).json(response);
      }
    } catch (e) {
      res.status(400).send(e);
    }
  });

  app.post('/admin/chat/room', authenticate, permit('admin'), async (req, res) => {
    let { creator_id, name, users, private } = req.body;
    try {
      const response = await chatkit.createRoom({
        creatorId: String(creator_id),
        name: name,
        isPrivate: private,
        userIds: users.map(id => String(id)),
      });
      if (response) {
        res.status(201).json(response);
      }
    } catch (e) {
      res.status(400).send(e);
    }
  });

  app.put('/admin/chat/room/:roomId', authenticate, permit('admin'), async (req, res) => {
    const data = { user_ids: req.body.users.map(userId => String(userId)) };
    const reqUrl = `https://us1.pusherplatform.io/services/chatkit/v1/${
      process.env.PUSHER_CHATKIT_INSTANCE_ID
    }/rooms/${req.params.roomId}/users/add`;
    const authorization = chatkit.authenticate({ userId: String(req.user._id) });
    try {
      const response = await axios.put(reqUrl, data, {
        headers: {
          Authorization: `Bearer ${authorization.body.access_token}`,
        },
      });
      res.status(response.status).send();
    } catch (e) {
      res.status(400).json(e);
    }
  });

  // roles

  app.get(
    '/admin/chat/roles',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const response = await chatkit.getRoles();
        if (response) {
          res.status(200).json(response);
        }
      } catch (e) {
        res.status(e.status).json(e);
      }
    }
  );

  app.get(
    '/admin/chat/:userId/roles',
    authenticate,
    permit('user', 'admin'),
    async (req, res) => {
      try {
        const response = await chatkit.getUserRoles({
          userId: req.params.userId,
        });
        res.status(200).json(response);
      } catch (e) {
        res.status(e.status).json(e);
      }
    }
  );

  app.post(
    '/admin/chat/:userId/global_role',
    authenticate,
    permit('admin'),
    async (req, res) => {
      const { role_name } = req.body;
      try {
        await chatkit.assignGlobalRoleToUser({
          userId: String(req.params.userId),
          roleName: role_name,
        });
        res.status(200).send();
      } catch (e) {
        res.status(400).send(e);
      }
    }
  );

  app.post('/admin/chat/global_role', authenticate, permit('admin'), async (req, res) => {
    let { name, permissions } = req.body;
    try {
      const response = await chatkit.createGlobalRole({
        name,
        permissions,
      });
      if (response) {
        res.status(201).send();
      }
    } catch (e) {
      res.status(400).send(e);
    }
  });

  app.delete(
    '/admin/chat/global_role/:globalRoleName',
    authenticate,
    permit('admin'),
    async (req, res) => {
      try {
        await chatkit.deleteGlobalRole({
          name: req.params.globalRoleName,
        });
        res.status(200).send();
      } catch (e) {
        res.status(400).send(e);
      }
    }
  );
};
