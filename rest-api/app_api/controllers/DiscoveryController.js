const mongoose = require('mongoose');
const redis = require('../services/redis');
const rabbitmq = require('../services/rabbitmq');
const Listing = mongoose.model('Listing');

const getListingsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const cacheKey = `category:${categoryId}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Kategori ilanlari Redis'ten getirildi: ${cacheKey}`);
      return res.status(200).json(JSON.parse(cached));
    }

    const listings = await Listing.find({
      category: categoryId,
      status: 'approved'
    }).sort({ createdAt: -1 });

    await redis.set(cacheKey, JSON.stringify(listings), 'EX', 300);

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      mesaj: 'Kategoriye gore ilanlar getirilirken bir hata olustu.',
      hata: error.message
    });
  }
};

const getShowcaseListings = async (req, res) => {
  try {
    const cacheKey = 'showcase:listings';
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Vitrin ilanlari Redis'ten getirildi.");
      return res.status(200).json(JSON.parse(cached));
    }

    const listings = await Listing.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(20);

    await redis.set(cacheKey, JSON.stringify(listings), 'EX', 600);

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      mesaj: 'Vitrin ilanlari getirilirken bir hata olustu.',
      hata: error.message
    });
  }
};

const searchListings = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ mesaj: 'Arama terimi bos olamaz.' });
    }

    const regex = new RegExp(q.trim(), 'i');
    const listings = await Listing.find({
      status: 'approved',
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
        { location: regex }
      ]
    }).sort({ createdAt: -1 }).limit(30);

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      mesaj: 'Arama sirasinda hata olustu.',
      hata: error.message
    });
  }
};

module.exports = {
  getListingsByCategory,
  getShowcaseListings,
  searchListings
};