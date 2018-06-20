module.exports = (sequelize, DataTypes) => {
    const ChatUserRoom = sequelize.define('chat_user_room', {
        chat_user_room_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER },
        chat_room_id: { type: DataTypes.INTEGER },
        last_read_message: { type: DataTypes.INTEGER },
        last_read_timestamp: { type: DataTypes.BIGINT },
    }, {
        timestamps: false,
    });
    return ChatUserRoom;
};
