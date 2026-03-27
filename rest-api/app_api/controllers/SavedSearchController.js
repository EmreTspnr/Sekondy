const mongoose = require('mongoose');
const SavedSearch = mongoose.model('SavedSearch');

const createSavedSearch = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      keyword,
      category,
      condition,
      location,
      minPrice,
      maxPrice
    } = req.body;

    const newSavedSearch = await SavedSearch.create({
      user: userId,
      keyword,
      category,
      condition,
      location,
      minPrice,
      maxPrice,
      notificationsEnabled: false
    });

    res.status(201).json({
      mesaj: 'Arama kriteri başarıyla kaydedildi.',
      savedSearch: newSavedSearch
    });
  } catch (error) {
    res.status(500).json({
      mesaj: 'Arama kriteri kaydedilirken bir hata oluştu.',
      hata: error.message
    });
  }
};

const updateSearchNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { searchId } = req.params;
    const { notificationsEnabled } = req.body;

    const updatedSearch = await SavedSearch.findOneAndUpdate(
      { _id: searchId, user: userId },
      { notificationsEnabled: Boolean(notificationsEnabled) },
      { new: true }
    );

    if (!updatedSearch) {
      return res.status(404).json({ mesaj: 'Kayıtlı arama bulunamadı.' });
    }

    res.status(200).json({
      mesaj: 'Arama bildirimi tercihi güncellendi.',
      savedSearch: updatedSearch
    });
  } catch (error) {
    res.status(500).json({
      mesaj: 'Bildirim ayarı güncellenirken bir hata oluştu.',
      hata: error.message
    });
  }
};

const deleteSavedSearch = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { searchId } = req.params;

    const deletedSearch = await SavedSearch.findOneAndDelete({
      _id: searchId,
      user: userId
    });

    if (!deletedSearch) {
      return res.status(404).json({ mesaj: 'Silinecek kayıtlı arama bulunamadı.' });
    }

    res.status(200).json({
      mesaj: 'Kayıtlı arama başarıyla silindi.'
    });
  } catch (error) {
    res.status(500).json({
      mesaj: 'Kayıtlı arama silinirken bir hata oluştu.',
      hata: error.message
    });
  }
};

module.exports = {
  createSavedSearch,
  updateSearchNotifications,
  deleteSavedSearch
};