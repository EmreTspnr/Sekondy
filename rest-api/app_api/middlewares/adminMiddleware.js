const mongoose = require('mongoose');

const User = mongoose.model('User');

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('isAdmin');
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);
    const hasAdminEmail = adminEmails.includes(req.user.email);

    if (!user) {
      return res.status(401).json({ mesaj: 'Kullanici bulunamadi.' });
    }

    if (!user.isAdmin && !hasAdminEmail) {
      return res.status(403).json({ mesaj: 'Bu islem icin yonetici yetkisi gerekiyor.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ mesaj: 'Yonetici yetkisi kontrol edilemedi.', hata: error.message });
  }
};

module.exports = requireAdmin;
