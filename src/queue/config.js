const amqp = require('amqplib/callback_api');

const connection = amqp.connect(process.env.AMQP_SERVER, function(err, conn) {
  if (err) {
    return err;
  }
  return conn;
});

const encode = obj => {
  return new Buffer(JSON.stringify(obj));
};

module.exports = { connection, encode };
