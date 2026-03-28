const mongoose = require('mongoose');
const Favorite = mongoose.model('Favorite');
const Listing = mongoose.model('Listing');

const addFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.body.listingId || req.body.adId;

    if (!listingId) {
      return res.status(400).json({ mesaj: 'Favorilere eklenecek ilan kimligi gereklidir.' });
    }

    const listingExists = await Listing.findById(listingId);
    if (!listingExists) {
      return res.status(404).json({ mesaj: 'Favorilere eklenecek ilan bulunamadi.' });
    }

    const existingFavorite = await Favorite.findOne({ user: userId, listing: listingId });
    if (existingFavorite) {
      return res.status(400).json({ mesaj: 'Bu ilan zaten favorilerinizde.' });
    }

    const newFavorite = await Favorite.create({ user: userId, listing: listingId });
    res.status(201).json({ mesaj: 'Ilan favorilere eklendi.', favorite: newFavorite });
  } catch (error) {
    res.status(500).json({ mesaj: 'Favorilere eklenirken hata olustu.', hata: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const favorites = await Favorite.find({ user: userId })
      .populate('listing')
      .sort({ createdAt: -1 });

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ mesaj: 'Favoriler getirilemedi.', hata: error.message });
  }
};

module.exports = {
  addFavorite,
  getFavorites
};
