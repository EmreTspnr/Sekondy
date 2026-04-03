const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');

const getListingsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const listings = await Listing.find({
      category: categoryId,
      status: 'approved'
    }).sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      mesaj: 'Kategoriye göre ilanlar getirilirken bir hata oluştu.',
      hata: error.message
    });
  }
};

const getShowcaseListings = async (req, res) => {
  try {
    const listings = await Listing.find({
      status: 'approved'
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      mesaj: 'Vitrin ilanları getirilirken bir hata oluştu.',
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