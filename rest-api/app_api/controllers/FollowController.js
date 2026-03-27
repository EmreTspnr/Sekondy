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

module.exports = {
  followSeller
};