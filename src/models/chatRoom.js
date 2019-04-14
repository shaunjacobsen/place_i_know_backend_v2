module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define(
    'chat_room',
    {
      chat_room_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      participants: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
      room_id: { type: DataTypes.STRING },
      title: { type: DataTypes.STRING },
      created: { type: DataTypes.TIME },
    },
    {
      timestamps: false,
    }
  );

  ChatRoom.associations = function(models) {
    ChatRoom.belongsToMany(models.user, {
      through: models.chat_user_room,
      foreignKey: 'chat_room_id',
      otherKey: 'user_id',
    });
  };

  ChatRoom.associate = function(models) {
    ChatRoom.hasMany(models.chat_message, {
      sourceKey: 'room_id',
      foreignKey: 'room_id',
    });
  };

  ChatRoom.prototype.isUserAuthorizedForRoomActions = async function(user) {
    if (user.role === 'admin') {
      return true;
    }

    try {
      let isAuthorized = false;
      const userRooms = await sequelize.models.chat_user_room.findAll({
        attributes: ['user_id'],
        where: { chat_room_id: this.chat_room_id },
      });
      if (userRooms.filter(userRoom => userRoom.user_id === user._id).length > 0) {
        isAuthorized = true;
      }
    } catch (e) {
      isAuthorized = false;
    } finally {
      return isAuthorized;
    }
  };

  ChatRoom.prototype.setUserReadMessage = async function(userId, pusherMessageId) {
    try {
      const message = await sequelize.models.chat_message.findOne({
        where: { pusher_message_id: Number(pusherMessageId) },
      });

      if (!message) {
        return { error: 'message not part of room' };
      }

      if (message.room_id === this.chat_room_id) {
        const updates = await sequelize.models.chat_user_room.update(
          {
            last_read_message: message.message_id,
            last_read_timestamp: new Date().getTime(),
          },
          {
            where: { chat_room_id: this.chat_room_id, user_id: userId },
          }
        );
        return { updated: updates };
      } else {
        return 0;
      }
    } catch (e) {
      return e.message;
    }
  };

  ChatRoom.prototype.createNewMessage = async function(userId, message) {
    try {
      const newMessage = await sequelize.models.chat_message
        .build({
          pusher_message_id: message.pusher_message_id,
          room_id: this.chat_room_id,
          pusher_room_id: this.room_id,
          from_user_id: userId,
          message: message.body,
          sent_at: new Date().getTime(),
        })
        .save();
      const markReadForSender = await this.setUserReadMessage(
        userId,
        newMessage.pusher_message_id
      );
    } catch (e) {
      return e.message;
    }
  };

  return ChatRoom;
};
