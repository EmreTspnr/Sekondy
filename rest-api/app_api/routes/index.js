const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ctrlListings = require('../controllers/ListingController');

// --- MULTER AYARLARI ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Resimler oluşturduğumuz 'uploads' klasörüne gidecek
    cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
    // Aynı isimli resimler çakışmasın diye isimlerin sonuna o anki tarihi ekliyoruz
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });
// -----------------------

// Test rotası
router.get('/', (req, res) => {
  res.status(200).json({ mesaj: "Sekondy API başarıyla çalışıyor!" });
});

// 7. Görev: İlan Ekleme
router.post('/listings', ctrlListings.addListing);

// ... önceki kodlar ...

// 8. Görev: İlana Fotoğraf Yükleme
router.post('/listings/:id/photos', upload.array('photos', 5), ctrlListings.uploadPhotos);

// YENİ EKLENEN: 12. Görev: Kendi İlanlarını Listeleme
router.get('/my-listings', ctrlListings.getMyListings);

module.exports = router;