const amqp = require('amqplib/callback_api');

const encode = obj => {
  return new Buffer(JSON.stringify(obj));
};

module.exports = {
  queueEmail: payload =>
    amqp.connect(process.env.AMQP_SERVER, (err, connection) => {
      if (err) {
        console.log(err.stack);
      } else {
        connection.createChannel((err, channel) => {
          if (err) {
            console.log(err.stack);
          } else {
            const queue = 'emails';

            channel.assertQueue(queue, { durable: true });
            channel.sendToQueue(queue, encode(payload), { persistent: true });
            console.log('sent to queue', payload);
          }
        });
      }
    }),
};
