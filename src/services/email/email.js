const amqp = require('amqplib/callback_api');
const { sendForgotPasswordEmail } = require('./actions/email');
require('./../../config/config');

amqp.connect(process.env.AMQP_SERVER, (err, connection) => {
  connection.createChannel((err, channel) => {
    const queue = 'emails';

    channel.assertQueue(queue, { durable: true });

    channel.consume(
      queue,
      message => {
        const payload = JSON.parse(message.content.toString());
        console.log('message received', payload);
        switch (payload.template) {
          case 'FORGOT_PASSWORD':
            sendForgotPasswordEmail(payload)
              .then(() => channel.ack(message))
              .catch(e => console.log(e));
            break;
          default:
            return;
        }
        console.log('message processed', message.content.toString());
      },
      { noAck: false }
    );
  });
});
