# Furkan Sarıbaş'ın Mobil Backend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek]

## 1. Kullanıcı Kayıt Olma
- **API Endpoint:** `POST /auth/register`
- **Görev:** BcryptJS kullanarak şifrelerin hash'lenmesi ve 409 (Zaten Kayıtlı) conflict kontrolünün Mongoose üzerinde yapılması.

## 2. Sisteme Giriş Yapma
- **API Endpoint:** `POST /auth/login`
- **Görev:** Email/Şifre kıyası ile güvenli JWT Token oluşturulması (`expiresIn: '1d'`).

## 3. Profil Bilgilerini Güncelleme
- **API Endpoint:** `PUT /users/:userId`
- **Görev:** JWT'den doğrulanan profil bilgilerinin (ad, soyad, vb.) veritabanı üzerinden kısmi güncellenmesi.

## 4. Kullanıcı Profilini Görüntüleme
- **API Endpoint:** `GET /users/:userId` (Projede `/auth/me` yaklaşımı)
- **Görev:** Oturum açan kullanıcının şifre gibi hassas veriler hariç profil bilgilerinin ekrana getirilmesi.

## 5. Kullanıcı Hesabını Silme
- **API Endpoint:** `DELETE /users/:userId`
- **Görev:** Kullanıcının isteğiyle veritabanından kaydının tamamen silinmesi.

## 6. Giriş Geçmişini Listeleme
- **API Endpoint:** `GET /users/:userId/login-history` (Login anında IP/Cihaz loglaması)
- **Görev:** Giriş yapılırken User-Agent ve IP verilerinin alınarak kullanıcının `loginHistory` dizisine işlenmesi.
