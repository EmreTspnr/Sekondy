const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const ctrlAuth = require('../controllers/AuthController'); 
const ctrlListings = require('../controllers/ListingController');
const ctrlFollow = require('../controllers/FollowController');
const ctrlSavedSearch = require('../controllers/SavedSearchController');
const ctrlDiscovery = require('../controllers/DiscoveryController');


const verifyToken = require('../middlewares/authMiddleware'); 


const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'uploads/') },
  filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname)) }
});
const upload = multer({ storage: storage });


router.get('/', (req, res) => {
  res.status(200).json({ mesaj: "Sekondy API başarıyla çalışıyor!" });
});

router.post('/auth/register', ctrlAuth.register);
router.post('/auth/login', ctrlAuth.login);
router.put('/profile', verifyToken, ctrlAuth.updateProfile);
router.get('/profile', verifyToken, ctrlAuth.getProfile);
router.delete('/profile', verifyToken, ctrlAuth.deleteProfile);
router.get('/auth/history', verifyToken, ctrlAuth.getLoginHistory);



router.post('/listings', verifyToken, ctrlListings.addListing);
router.post('/listings/:id/photos', verifyToken, upload.array('photos', 5), ctrlListings.uploadPhotos);
router.put('/listings/:id', verifyToken, ctrlListings.updateListing);
router.delete('/listings/:id', verifyToken, ctrlListings.deleteListing);
router.get('/my-listings', verifyToken, ctrlListings.getMyListings);
router.get('/listings/:id', ctrlListings.getListingById); // Herkese açık


router.post('/users/:userId/follow', verifyToken, ctrlFollow.followSeller);
router.post('/saved-searches', verifyToken, ctrlSavedSearch.createSavedSearch);
router.put('/saved-searches/:searchId/notifications', verifyToken, ctrlSavedSearch.updateSearchNotifications);
router.delete('/saved-searches/:searchId', verifyToken, ctrlSavedSearch.deleteSavedSearch);
router.get('/listings/category/:categoryId', ctrlDiscovery.getListingsByCategory);
router.get('/listings/showcase', ctrlDiscovery.getShowcaseListings);

module.exports = router;