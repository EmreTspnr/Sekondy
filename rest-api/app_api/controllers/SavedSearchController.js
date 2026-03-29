const mongoose = require('mongoose');
const SavedSearch = mongoose.model('SavedSearch');

const parseBooleanInput = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
};

const createSavedSearch = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      keyword,
      query,
      category,
      categoryId,
      condition,
      location,
      minPrice,
      maxPrice
    } = req.body;

    const newSavedSearch = await SavedSearch.create({
      user: userId,
      keyword: keyword ?? query ?? '',
      category: category ?? categoryId ?? '',
      condition,
      location,
      minPrice,
      maxPrice,
      notificationsEnabled: false
    });

    res.status(201).json({
      mesaj: 'Arama kriteri basariyla kaydedildi.',
      savedSearch: newSavedSearch
    });
  } catch (error) {
    res.status(500).json({
      mesaj: 'Arama kriteri kaydedilirken bir hata olustu.',
      hata: error.message
    });
  }
};

const updateSearchNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { searchId } = req.params;
    const notificationsEnabled = parseBooleanInput(
      req.body.notificationsEnabled ?? req.body.enabled
    );

    if (notificationsEnabled === undefined) {
      return res.status(400).json({
        mesaj: 'Bildirim tercihi icin gecerli bir boolean deger gonderin.'
      });
    }

    const updatedSearch = await SavedSearch.findOneAndUpdate(
      { _id: searchId, user: userId },
      { notificationsEnabled },
      { new: true }
    );

    if (!updatedSearch) {
      return res.status(404).json({ mesaj: 'Kayitli arama bulunamadi.' });
    }

    res.status(200).json({
      mesaj: 'Arama bildirimi tercihi guncellendi.',
      savedSearch: updatedSearch
    });
  } catch (error) {
    res.status(500).json({
      mesaj: 'Bildirim ayari guncellenirken bir hata olustu.',
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
      return res.status(404).json({ mesaj: 'Silinecek kayitli arama bulunamadi.' });
    }

    res.status(200).json({
      mesaj: 'Kayitli arama basariyla silindi.'
    });
  } catch (error) {
    res.status(500).json({
      mesaj: 'Kayitli arama silinirken bir hata olustu.',
      hata: error.message
    });
  }
};

module.exports = {
  createSavedSearch,
  updateSearchNotifications,
  deleteSavedSearch
};
