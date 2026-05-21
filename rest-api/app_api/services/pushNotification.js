const https = require('https');

const sendPushNotification = (expoPushToken, title, body, data = {}) => {
  if (!expoPushToken) return Promise.resolve();

  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: data,
  };

  const payload = JSON.stringify(message);

  const options = {
    hostname: 'exp.host',
    path: '/--/api/v2/push/send',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          console.log('Push notification response:', JSON.parse(responseBody));
          resolve(JSON.parse(responseBody));
        } catch (e) {
          resolve(responseBody);
        }
      });
    });

    req.on('error', (e) => {
      console.error('Error sending push notification:', e);
      reject(e);
    });

    req.write(payload);
    req.end();
  });
};

module.exports = {
  sendPushNotification
};
