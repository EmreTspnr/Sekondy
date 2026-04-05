# Furkan Sarıbaş'ın REST API Metotları

**API Test Videosu:** [https://youtu.be/XfQASzGdI34]

## 1. Kullanıcı Kayıt Olma
- **Endpoint:** `POST /auth/register`
- **Request Body:** 
  ```json
  {
    "firstName": "Furkan",
    "lastName": "Sarıbaş",
    "email": "furkan@example.com",
    "password": "GuvenliSifre123",
    "phone": "05551234567",
    "address": "İstanbul, Türkiye"
  }
  ```
- **Authentication:** Gerekli değil
- **Response:** `201 Created` - Kullanıcı başarıyla oluşturuldu

## 2. Sisteme Giriş Yapma
- **Endpoint:** `POST /auth/login`
- **Request Body:** 
  ```json
  {
    "email": "furkan@example.com",
    "password": "GuvenliSifre123"
  }
  ```
- **Authentication:** Gerekli değil
- **Response:** `200 OK` - Başarıyla giriş yapıldı, JWT Token döndürülür

## 3. Profil Bilgilerini Güncelleme
- **Endpoint:** `PUT /profile`
- **Request Body:** 
  ```json
  {
    "firstName": "Furkan",
    "lastName": "Sarıbaş",
    "phone": "05559876543",
    "address": "Ankara, Türkiye"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Profil başarıyla güncellendi

## 4. Kullanıcı Profilini Görüntüleme
- **Endpoint:** `GET /profile`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının güncel profil bilgileri döndürülür

## 5. Kullanıcı Hesabını Silme
- **Endpoint:** `DELETE /profile`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Hesap sistemden başarıyla silindi

## 6. Giriş Geçmişini Listeleme
- **Endpoint:** `GET /auth/history`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının son giriş yaptığı cihazlar ve IP logları döndürülür