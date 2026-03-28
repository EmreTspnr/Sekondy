const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

require('./app_api/models/db');

const apiRoutes = require('./app_api/routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/v1', apiRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda basariyla calisiyor!`);
  });
}

module.exports = app;
