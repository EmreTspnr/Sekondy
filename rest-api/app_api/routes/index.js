const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

const ctrlAuth = require('../controllers/AuthController');
const ctrlListings = require('../controllers/ListingController');
const ctrlFollow = require('../controllers/FollowController');
const ctrlSavedSearch = require('../controllers/SavedSearchController');
const ctrlDiscovery = require('../controllers/DiscoveryController');
const ctrlFavorite = require('../controllers/FavoriteController');
const ctrlMessage = require('../controllers/MessageController');
const adminRoutes = require('./adminRoutes');

const verifyToken = require('../middlewares/authMiddleware');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sekondy_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});
const upload = multer({ storage: storage });

router.get('/', (_req, res) => {
  res.status(200).json({ mesaj: 'Sekondy API basariyla calisiyor!' });
});

router.post('/auth/register', ctrlAuth.register);
router.post('/auth/login', ctrlAuth.login);
router.put('/profile', verifyToken, ctrlAuth.updateProfile);
router.get('/profile', verifyToken, ctrlAuth.getProfile);
router.delete('/profile', verifyToken, ctrlAuth.deleteProfile);
router.get('/auth/history', verifyToken, ctrlAuth.getLoginHistory);


router.post('/listings', verifyToken, ctrlListings.addListing);
router.post('/ads', verifyToken, ctrlListings.addListing);
router.post('/listings/:id/photos', verifyToken, upload.array('photos', 5), ctrlListings.uploadPhotos);
router.post('/ads/:id/photos', verifyToken, upload.array('photos', 5), ctrlListings.uploadPhotos);
router.put('/listings/:id', verifyToken, ctrlListings.updateListing);
router.put('/ads/:id', verifyToken, ctrlListings.updateListing);
router.delete('/listings/:id', verifyToken, ctrlListings.deleteListing);
router.delete('/ads/:id', verifyToken, ctrlListings.deleteListing);
router.get('/my-listings', verifyToken, ctrlListings.getMyListings);
router.get('/my-ads', verifyToken, ctrlListings.getMyListings);

router.post('/users/:userId/follow', verifyToken, ctrlFollow.followSeller);
router.get('/follows', verifyToken, ctrlFollow.getFollowedSellers);
router.delete('/users/:userId/follow', verifyToken, ctrlFollow.unfollowSeller);
router.post('/saved-searches', verifyToken, ctrlSavedSearch.createSavedSearch);
router.get('/saved-searches', verifyToken, ctrlSavedSearch.getSavedSearches);
router.put('/saved-searches/:searchId/notifications', verifyToken, ctrlSavedSearch.updateSearchNotifications);
router.delete('/saved-searches/:searchId', verifyToken, ctrlSavedSearch.deleteSavedSearch);
router.get('/listings/showcase', ctrlDiscovery.getShowcaseListings);
router.get('/ads/showcase', ctrlDiscovery.getShowcaseListings);
router.get('/listings/search', ctrlDiscovery.searchListings);
router.get('/ads/search', ctrlDiscovery.searchListings);
router.get('/listings/category/:categoryId', ctrlDiscovery.getListingsByCategory);
router.get('/ads/category/:categoryId', ctrlDiscovery.getListingsByCategory);
router.get('/categories/:categoryId/listings', ctrlDiscovery.getListingsByCategory);
router.get('/listings/:id', ctrlListings.getListingById);
router.get('/ads/:id', ctrlListings.getListingById);

router.post('/favorites', verifyToken, ctrlFavorite.addFavorite);
router.get('/favorites', verifyToken, ctrlFavorite.getFavorites);
router.delete('/favorites/:id', verifyToken, ctrlFavorite.deleteFavorite);

router.post('/messages', verifyToken, ctrlMessage.sendMessage);
router.get('/messages', verifyToken, ctrlMessage.getMessages);
router.put('/messages/:messageId/read', verifyToken, ctrlMessage.markAsRead);
router.delete('/messages/:messageId', verifyToken, ctrlMessage.deleteMessage);

router.use('/', adminRoutes);

module.exports = router;
