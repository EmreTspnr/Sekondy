const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyToken = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/adminMiddleware');

router.post('/reports', verifyToken, adminController.reportListing);
router.post('/listings/:listingId/reports', verifyToken, adminController.reportListing);

router.put('/admin/ads/:adId/approve', verifyToken, requireAdmin, adminController.approveListing);
router.put('/admin/listings/:listingId/approve', verifyToken, requireAdmin, adminController.approveListing);
router.put('/admin/users/:userId/suspend', verifyToken, requireAdmin, adminController.suspendUser);
router.delete('/admin/ads/:adId', verifyToken, requireAdmin, adminController.deleteListing);
router.delete('/admin/listings/:listingId', verifyToken, requireAdmin, adminController.deleteListing);
router.get('/admin/ads/pending', verifyToken, requireAdmin, adminController.getPendingListings);
router.get('/admin/listings/pending', verifyToken, requireAdmin, adminController.getPendingListings);
router.get('/admin/reports', verifyToken, requireAdmin, adminController.getReportedListings);
router.get('/admin/listings/reported', verifyToken, requireAdmin, adminController.getReportedListings);

module.exports = router;
