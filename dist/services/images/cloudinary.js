const amqp = require('amqplib/callback_api');
require('./../../config/config');
const { removeImageFromCloudinary } = require('./actions/image');
amqp.connect(process.env.AMQP_SERVER, (err, connection) => {
    connection.createChannel((err, channel) => {
        const queue = 'images';
        channel.assertQueue(queue, { durable: true });
        channel.consume(queue, message => {
            const payload = JSON.parse(message.content.toString());
            console.log('message received', payload);
            switch (payload.function) {
                case 'REMOVE_CLOUDINARY_IMAGE':
                    removeImageFromCloudinary(payload.cloudinaryPublicId)
                        .then(() => channel.ack(message))
                        .catch(e => console.log(e));
                    break;
                default:
                    return;
            }
            console.log('message processed', message.content.toString());
        }, { noAck: false });
    });
});
