const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// --- KONTROLCÜLER (CONTROLLERS) ---
const ctrlListings = require('../controllers/ListingController');
const ctrlAuth = require('../controllers/AuthController'); // YENİ EKLENDİ

// --- MİDDLEWARE'LER ---
const verifyToken = require('../middlewares/authMiddleware'); // YENİ EKLENDİ

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
router.post('/listings', verifyToken, ctrlListings.addListing);

// ... önceki kodlar ...

// 8. Görev: İlana Fotoğraf Yükleme
router.post('/listings/:id/photos', upload.array('photos', 5), ctrlListings.uploadPhotos);

// YENİ EKLENEN: 12. Görev: Kendi İlanlarını Listeleme
router.get('/my-listings', ctrlListings.getMyListings);
// ... önceki rotalar ...

// YENİ EKLENEN: 9. Görev: İlan Bilgilerini Güncelleme
router.put('/listings/:id', ctrlListings.updateListing);

// ... önceki rotalar ...

// YENİ EKLENEN: 10. Görev: İlan Detaylarını Görüntüleme
router.get('/listings/:id', ctrlListings.getListingById);

// ... önceki rotalar ...

// 11. Görev: İlanı Silme
router.post('/listings/:id', ctrlListings.deleteListing); // Bazı sistemlerde DELETE yerine POST kullanılır ama doğrusu:
router.delete('/listings/:id', verifyToken, ctrlListings.deleteListing);

module.exports = router;