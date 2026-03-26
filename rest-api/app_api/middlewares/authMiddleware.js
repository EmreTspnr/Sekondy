const jwt = require('jsonwebtoken');

// AuthController'da kullandığımız gizli anahtarın aynısı
const JWT_SECRET = 'sekondy_super_gizli_anahtar_123';

const verifyToken = (req, res, next) => {
  // İstek başlıklarından (headers) Authorization kısmını alıyoruz
  const authHeader = req.headers.authorization;

  // Eğer token yoksa veya "Bearer " ile başlamıyorsa reddet
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mesaj: "Erişim reddedildi. Geçerli bir token sağlanmadı." });
  }

  // "Bearer " kısmını atıp sadece token'ı alıyoruz
  const token = authHeader.split(' ')[1];

  try {
    // Token'ı doğruluyoruz
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Doğrulanan kullanıcının bilgilerini (userId ve email) isteğin içine ekliyoruz
    req.user = decoded; 
    
    // İşlem başarılıysa bir sonraki fonksiyona (Controller'a) geçiş izni ver
    next();
  } catch (error) {
    res.status(403).json({ mesaj: "Geçersiz veya süresi dolmuş token." });
  }
};

module.exports = verifyToken;