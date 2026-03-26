const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// 1. İlan Şikayet Etme
router.post('/listings/:listingId/reports', adminController.reportListing);

// 2. İlan Durumunu Onaylama
router.put('/admin/listings/:listingId/approve', adminController.approveListing);

// 3. Kullanıcı Hesabını Askıya Alma
router.put('/admin/users/:userId/suspend', adminController.suspendUser);

// 4. Uygunsuz İlanı Silme
router.delete('/admin/listings/:listingId', adminController.deleteListing);

// 5. Onay Bekleyen İlanları Listeleme
router.get('/admin/listings/pending', adminController.getPendingListings);

// 6. Şikayet Edilen İlanları Listeleme
router.get('/admin/listings/reported', adminController.getReportedListings);

module.exports = router;