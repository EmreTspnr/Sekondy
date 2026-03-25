const express = require('express');
const router = express.Router();

// Sistemin çalışıp çalışmadığını test etmek için basit bir rota
router.get('/', (req, res) => {
  res.status(200).json({ mesaj: "Sekondy API başarıyla çalışıyor!" });
});

module.exports = router;