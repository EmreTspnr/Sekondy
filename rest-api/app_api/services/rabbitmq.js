const amqp = require('amqplib');

let channel = null;

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ successfully');
    } catch (err) {
        console.error('RabbitMQ connection error:', err);
    }
}

connectRabbitMQ();

// Helper function to send messages to a specific queue
async function publishToQueue(queueName, data) {
    if (!channel) {
        console.error('RabbitMQ channel not initialized');
        return;
    }
    
    try {
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
        console.log(`Message sent to queue ${queueName}`);
    } catch (err) {
        console.error(`Error sending message to queue ${queueName}:`, err);
    }
}

module.exports = {
    publishToQueue
};
