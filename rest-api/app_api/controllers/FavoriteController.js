const mongoose = require('mongoose');
const redis = require('../services/redis');
const rabbitmq = require('../services/rabbitmq');
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

    // RabbitMQ: Ilan sahibine "ilaniniz favorilere eklendi" bildirimi icin kuyruga yaz
    rabbitmq.publishToQueue('FavoriyeEklendi', {
      userId: userId,
      ilanId: listingId,
      ilanSahibiId: listingExists.owner,
      timestamp: new Date()
    });

    // Favoriler listesi degisti, onbellegi temizle
    await redis.del(`favorites:${userId}`);

    res.status(201).json({ mesaj: 'Ilan favorilere eklendi.', favorite: newFavorite });
  } catch (error) {
    res.status(500).json({ mesaj: 'Favorilere eklenirken hata olustu.', hata: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Redis Cache-Aside: Once onbellekten kontrol et
    const cacheKey = `favorites:${userId}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Favoriler Redis'ten getirildi: ${cacheKey}`);
      return res.status(200).json(JSON.parse(cached));
    }

    const favorites = await Favorite.find({ user: userId })
      .populate('listing')
      .sort({ createdAt: -1 });

    // 5 dakika (300 sn) onbellege al
    await redis.set(cacheKey, JSON.stringify(favorites), 'EX', 300);

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ mesaj: 'Favoriler getirilemedi.', hata: error.message });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const deleted = await Favorite.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) {
      return res.status(404).json({ mesaj: 'Silinecek favori bulunamadi.' });
    }

    // Favorilerden silince onbellegi temizle
    await redis.del(`favorites:${userId}`);

    res.status(200).json({ mesaj: 'Favorilerden basariyla kaldirildi.' });
  } catch (error) {
    res.status(500).json({ mesaj: 'Favori silinirken hata olustu.', hata: error.message });
  }
};

const deleteFavoriteByListing = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { listingId } = req.params;

    const deleted = await Favorite.findOneAndDelete({ listing: listingId, user: userId });
    if (!deleted) {
      return res.status(404).json({ mesaj: 'Silinecek favori bulunamadi.' });
    }

    // Favorilerden silince onbellegi temizle
    await redis.del(`favorites:${userId}`);

    res.status(200).json({ mesaj: 'Favorilerden basariyla kaldirildi.' });
  } catch (error) {
    res.status(500).json({ mesaj: 'Favori silinirken hata olustu.', hata: error.message });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  deleteFavorite,
  deleteFavoriteByListing
};