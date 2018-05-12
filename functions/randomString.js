const uuid = require('uuid/v1');

module.exports = {
  generateRandomString: () => {
    return uuid();
  },
};
