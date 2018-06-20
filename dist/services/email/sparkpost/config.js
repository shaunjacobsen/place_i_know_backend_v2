const SparkPost = require('sparkpost');
require('./../../../config/config');
const emailClient = new SparkPost(process.env.SPARKPOST_API_KEY);
module.exports = { emailClient };
