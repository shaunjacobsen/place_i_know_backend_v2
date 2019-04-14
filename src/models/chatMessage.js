module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define(
    'chat_message',
    {
      message_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      pusher_message_id: { type: DataTypes.INTEGER },
      room_id: { type: DataTypes.STRING },
      pusher_room_id: { type: DataTypes.STRING },
      from_user_id: { type: DataTypes.INTEGER },
      message: { type: DataTypes.STRING },
      sent_at: { type: DataTypes.BIGINT },
    },
    {
      timestamps: false,
    }
  );
  
  ChatMessage.associations = function(models) {
    ChatMessage.belongsTo(models.chat_room, { foreignKey: 'room_id' });
  };

  return ChatMessage;
};
