var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define('chat_room', {
        chat_room_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        room_id: { type: DataTypes.INTEGER },
        title: { type: DataTypes.STRING },
        created: { type: DataTypes.TIME },
        created_by: { type: DataTypes.INTEGER },
    }, {
        timestamps: false,
    });
    ChatRoom.associations = function (models) {
        ChatRoom.belongsToMany(models.user, {
            through: models.chat_user_room,
            foreignKey: 'chat_room_id',
            otherKey: 'user_id',
        });
    };
    ChatRoom.associate = function (models) {
        ChatRoom.hasMany(models.chat_message, {
            sourceKey: 'room_id',
            foreignKey: 'room_id',
        });
    };
    ChatRoom.prototype.isUserAuthorizedForRoomActions = function (user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.role === 'admin') {
                return true;
            }
            try {
                let isAuthorized = false;
                const userRooms = yield sequelize.models.chat_user_room.findAll({
                    attributes: ['user_id'],
                    where: { chat_room_id: this.chat_room_id },
                });
                if (userRooms.filter(userRoom => userRoom.user_id === user._id).length > 0) {
                    isAuthorized = true;
                }
            }
            catch (e) {
                isAuthorized = false;
            }
            finally {
                return isAuthorized;
            }
        });
    };
    ChatRoom.prototype.setUserReadMessage = function (userId, pusherMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield sequelize.models.chat_message.findOne({
                    where: { pusher_message_id: Number(pusherMessageId) },
                });
                if (!message) {
                    return { error: 'message not part of room' };
                }
                if (message.room_id === this.chat_room_id) {
                    const updates = yield sequelize.models.chat_user_room.update({
                        last_read_message: message.message_id,
                        last_read_timestamp: new Date().getTime(),
                    }, {
                        where: { chat_room_id: this.chat_room_id, user_id: userId },
                    });
                    return { updated: updates };
                }
                else {
                    return 0;
                }
            }
            catch (e) {
                return e.message;
            }
        });
    };
    ChatRoom.prototype.createNewMessage = function (userId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = yield sequelize.models.chat_message.build({
                    pusher_message_id: message.pusher_message_id,
                    room_id: this.chat_room_id,
                    pusher_room_id: this.room_id,
                    from_user_id: userId,
                    message: message.body,
                    sent_at: new Date().getTime(),
                }).save();
                const markReadForSender = yield this.setUserReadMessage(userId, newMessage.pusher_message_id);
            }
            catch (e) {
                return e.message;
            }
        });
    };
    return ChatRoom;
};
