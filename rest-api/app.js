const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Veritabanı bağlantısını projeye dahil ediyoruz
require('./app_api/models/db'); 

// Rotaları projeye dahil ediyoruz
const apiRoutes = require('./app_api/routes/index');

const app = express();

// Gelen JSON verilerini okuyabilmek için
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Tüm API istekleri /v1 ile başlasın
app.use('/v1', apiRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başarıyla çalışıyor!`);
});