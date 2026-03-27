const mongoose = require('mongoose');

let dbURI = 'mongodb://127.0.0.1:27017/sekondy'; 

mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
  console.log(`Mongoose ${dbURI} adresine bağlandı`);
});

mongoose.connection.on('error', err => {
  console.log(`Mongoose bağlantı hatası: ${err}`);
});

require('./listing');
require('./user');
require('./report'); // EKSİK OLAN EKLENDİ
require('./follow');
require('./savedSearch');