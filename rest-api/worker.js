const amqp = require('amqplib');
require('dotenv').config(); // Load environment variables if run independently

const QUEUES = [
    'YeniKullaniciKayit',
    'FavoriyeEklendi',
    'YeniTakipci',
    'YeniIlanOnayBekliyor',
    'YeniMesaj',
    'YeniAramaKaydedildi',
    'IlanOnaylandi'
];

async function startWorker() {
    try {
        console.log('RabbitMQ Worker is starting...');
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost:5672');
        const channel = await connection.createChannel();

        console.log('Connected to RabbitMQ successfully. Listening for messages...');

        for (const queue of QUEUES) {
            await channel.assertQueue(queue, { durable: true });
            
            channel.consume(queue, (msg) => {
                if (msg !== null) {
                    const data = JSON.parse(msg.content.toString());
                    console.log(`\n[WORKER] Received event from queue: ${queue}`);
                    console.log(`[WORKER] Payload:`, data);
                    
                    // Burada e-posta veya push bildirimi gönderimi yapılabilir
                    // Şimdilik sadece mesajı başarıyla işlenmiş (ack) olarak işaretliyoruz.
                    
                    channel.ack(msg);
                }
            }, { noAck: false });
        }
    } catch (err) {
        console.error('RabbitMQ Worker error:', err);
        // Hata durumunda 5 saniye sonra tekrar bağlanmayı dene
        setTimeout(startWorker, 5000);
    }
}

startWorker();
