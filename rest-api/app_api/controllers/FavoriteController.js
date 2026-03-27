const mongoose = require('mongoose');
const Favorite = mongoose.model('Favorite');
const Listing = mongoose.model('Listing');

// 1. İlanı Favorilere Ekleme
const addFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { listingId } = req.body;

    // İlan var mı kontrolü
    const listingExists = await Listing.findById(listingId);
    if (!listingExists) {
      return res.status(404).json({ mesaj: "Favorilere eklenecek ilan bulunamadı." });
    }

    // Zaten eklenmiş mi kontrolü
    const existingFavorite = await Favorite.findOne({ user: userId, listing: listingId });
    if (existingFavorite) {
      return res.status(400).json({ mesaj: "Bu ilan zaten favorilerinizde." });
    }

    const newFavorite = await Favorite.create({ user: userId, listing: listingId });
    res.status(201).json({ mesaj: "İlan favorilere eklendi.", favorite: newFavorite });
  } catch (error) {
    res.status(500).json({ mesaj: "Favorilere eklenirken hata oluştu.", hata: error.message });
  }
};

// 2. Favori İlanları Listeleme
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Favorileri getirirken ilan detaylarını da populate ile çekiyoruz
    const favorites = await Favorite.find({ user: userId })
      .populate('listing')
      .sort({ createdAt: -1 });

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ mesaj: "Favoriler getirilemedi.", hata: error.message });
  }
};

module.exports = {
  addFavorite,
  getFavorites
};