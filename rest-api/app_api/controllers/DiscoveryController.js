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
      status: 'approved',
      isShowcase: true
    })
      .sort({ createdAt: -1 })
      .limit(12);

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      mesaj: 'Vitrin ilanları getirilirken bir hata oluştu.',
      hata: error.message
    });
  }
};

module.exports = {
  getListingsByCategory,
  getShowcaseListings
};