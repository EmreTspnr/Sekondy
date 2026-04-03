const mongoose = require('mongoose');
const Follow = mongoose.model('Follow');
const User = mongoose.model('User');

const followSeller = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const { userId: sellerId } = req.params;

    if (followerId === sellerId) {
      return res.status(400).json({ mesaj: 'Kullanıcı kendisini takip edemez.' });
    }

    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ mesaj: 'Takip edilecek satıcı bulunamadı.' });
    }

    const existingFollow = await Follow.findOne({
      follower: followerId,
      seller: sellerId
    });

    if (existingFollow) {
      return res.status(400).json({ mesaj: 'Bu satıcı zaten takip ediliyor.' });
    }

    const newFollow = await Follow.create({
      follower: followerId,
      seller: sellerId
    });

    res.status(201).json({
      mesaj: 'Satıcı başarıyla takip edildi.',
      follow: newFollow
    });
  } catch (error) {
    res.status(500).json({
      mesaj: 'Satıcı takip edilirken bir hata oluştu.',
      hata: error.message
    });
  }
};

const getFollowedSellers = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const follows = await Follow.find({ follower: followerId })
      .populate('seller', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(follows);
  } catch (error) {
    res.status(500).json({ mesaj: 'Takip edilen saticilar getirilemedi.', hata: error.message });
  }
};

const unfollowSeller = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const { userId: sellerId } = req.params;

    const deleted = await Follow.findOneAndDelete({ follower: followerId, seller: sellerId });
    if (!deleted) {
      return res.status(404).json({ mesaj: 'Takip kaydı bulunamadı.' });
    }
    res.status(200).json({ mesaj: 'Takipten çıkıldı.' });
  } catch (error) {
    res.status(500).json({ mesaj: 'Takipten çıkılırken hata oluştu.', hata: error.message });
  }
};

module.exports = {
  followSeller,
  getFollowedSellers,
  unfollowSeller
};