const ChatKit = require('@pusher/chatkit-server');

const chatkit = new ChatKit.default({
  instanceLocator: process.env.PUSHER_CHATKIT_INSTANCE_LOCATOR,
  key: process.env.PUSHER_CHATKIT_KEY,
});

module.exports = { chatkit };