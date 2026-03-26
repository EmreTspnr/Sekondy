const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Geliştirme aşaması için gizli anahtar (İleride .env dosyasına taşınmalı)
const JWT_SECRET = 'sekondy_super_gizli_anahtar_123';

// 1. Görev: Kullanıcı Kayıt Olma
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;

    // Temel doğrulama
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ mesaj: "Lütfen ad, soyad, e-posta ve şifre alanlarını doldurun." });
    }

    // E-posta daha önce kullanılmış mı kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ mesaj: "Bu e-posta adresi zaten kullanımda." });
    }

    // Şifreyi güvenli hale getirme (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcıyı oluşturma
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      loginHistory: []
    });

    res.status(201).json({ mesaj: "Kullanıcı başarıyla oluşturuldu.", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ mesaj: "Kayıt işlemi sırasında bir hata oluştu.", hata: error.message });
  }
};

// 2. Görev: Sisteme Giriş Yapma
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ mesaj: "Lütfen e-posta ve şifrenizi girin." });
    }

    // Kullanıcıyı veritabanında bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ mesaj: "Kullanıcı bulunamadı." });
    }
    // Şifreyi kontrol etmeden önce kullanıcının ban durumuna bak
if (user.isSuspended) {
  return res.status(403).json({ mesaj: "Hesabınız yönetici tarafından askıya alınmıştır." });
}

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ mesaj: "Hatalı şifre girdiniz." });
    }

    // 6. Görev için: Giriş geçmişini kaydet (İstek yapılan IP ve cihaz bilgisini alarak)
    const ipAddress = req.ip || req.connection.remoteAddress;
    const device = req.headers['user-agent'] || 'Bilinmeyen Cihaz';
    
    user.loginHistory.push({ ipAddress, device });
    await user.save();

    // Oturum yönetimi için JWT (JSON Web Token) oluştur
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '1d' } // Token 1 gün geçerli olsun
    );

    res.status(200).json({ 
      mesaj: "Başarıyla giriş yapıldı.", 
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ mesaj: "Giriş işlemi sırasında bir hata oluştu.", hata: error.message });
  }
};

// ... önceki register ve login kodları ...

// 3. Görev: Profil Bilgilerini Güncelleme
const updateProfile = async (req, res) => {
  try {
    // Middleware'den gelecek olan giriş yapmış kullanıcının ID'si
    const userId = req.user.userId; 
    
    // Kullanıcının değiştirmek isteyebileceği alanları alıyoruz
    const { phone, address, firstName, lastName } = req.body;

    // Veritabanında kullanıcıyı bul ve güncelle.
    // { new: true } güncellenmiş veriyi döndürür.
    // .select('-password') şifreyi güvenlik gereği yanıttan çıkarır.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { phone, address, firstName, lastName },
      { new: true, runValidators: true }
    ).select('-password'); 

    if (!updatedUser) {
      return res.status(404).json({ mesaj: "Güncellenecek kullanıcı bulunamadı." });
    }

    res.status(200).json({ mesaj: "Profiliniz başarıyla güncellendi.", user: updatedUser });
  } catch (error) {
    res.status(500).json({ mesaj: "Profil güncellenirken bir hata oluştu.", hata: error.message });
  }
};

// 4. Görev: Kullanıcı Profilini Görüntüleme
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Kullanıcıyı bul ve şifresi hariç tüm bilgilerini getir
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ mesaj: "Kullanıcı bulunamadı." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ mesaj: "Profil bilgileri getirilirken bir hata oluştu.", hata: error.message });
  }
};

// 5. Görev: Kullanıcı Hesabını Silme
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // findByIdAndDelete komutu ile kullanıcıyı sistemden tamamen kaldırıyoruz
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ mesaj: "Silinecek kullanıcı bulunamadı." });
    }

    res.status(200).json({ mesaj: "Hesabınız sistemden başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ mesaj: "Hesap silinirken bir hata oluştu.", hata: error.message });
  }
};

// 6. Görev: Giriş Geçmişini Listeleme
const getLoginHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Sadece kullanıcının loginHistory dizisini çekiyoruz
    const user = await User.findById(userId).select('loginHistory');

    if (!user) {
      return res.status(404).json({ mesaj: "Kullanıcı bulunamadı." });
    }

    // En son yapılan girişlerin en üstte görünmesi için diziyi tersine çeviriyoruz
    const history = user.loginHistory.reverse();

    res.status(200).json({ loginHistory: history });
  } catch (error) {
    res.status(500).json({ mesaj: "Giriş geçmişi getirilirken bir hata oluştu.", hata: error.message });
  }
};

// DOSYANIN EN ALTINDAKİ EXPORT KISMINI ŞÖYLE GÜNCELLEMELİSİN:
module.exports = {
  register,
  login,
  updateProfile,
  getProfile,
  deleteProfile,
  getLoginHistory
};