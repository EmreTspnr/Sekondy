# Sinan Ece'in REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Satıcıyı Takip Etme
- **Endpoint:** `POST /users/{userId}/follow`
- **Path Parameters:** 
  - `userId` (string, required) - Takip edilecek satıcının ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Satıcı başarıyla takip edildi

## 2. Satıcıyı Takipten Çıkarma
- **Endpoint:** `DELETE /users/{userId}/follow`
- **Path Parameters:** 
  - `userId` (string, required) - Takipten çıkılacak satıcının ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Takipten çıkıldı

## 3. Takip Edilen Satıcıları Listeleme
- **Endpoint:** `GET /follows`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Takip edilen satıcıların listesi (Kullanıcı detayları ile) döndürülür

## 4. Arama Kriterlerini Kaydetme
- **Endpoint:** `POST /saved-searches`
- **Request Body:** 
  ```json
  {
    "keyword": "iphone",
    "category": "Elektronik",
    "minPrice": 10000,
    "maxPrice": 30000
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Arama kriteri başarıyla kaydedildi

## 5. Arama Bildirimlerini Açma/Kapatma
- **Endpoint:** `PUT /saved-searches/{searchId}/notifications`
- **Path Parameters:** 
  - `searchId` (string, required) - Kayıtlı aramanın ID'si
- **Request Body:** 
  ```json
  {
    "notificationsEnabled": true
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Arama bildirimi tercihi güncellendi

## 6. Kayıtlı Aramayı Silme
- **Endpoint:** `DELETE /saved-searches/{searchId}`
- **Path Parameters:** 
  - `searchId` (string, required) - Silinecek kayıtlı aramanın ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kayıtlı arama başarıyla silindi

## 7. Kayıtlı Aramaları Listeleme
- **Endpoint:** `GET /saved-searches`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının daha önce kaydettiği tüm aramalar döndürülür

## 8. Kategoriye Göre İlan Listeleme
- **Endpoint:** `GET /categories/{categoryId}/listings`
- **Path Parameters:** 
  - `categoryId` (string, required) - İlanların filtreleneceği kategori adı veya numarası (örn. "Elektronik")
- **Authentication:** Gerekli değil (Herkes görebilir)
- **Response:** `200 OK` - O kategoriye ait ilanlar döndürülür

## 9. Serbest Kelime ile İlan Arama
- **Endpoint:** `GET /listings/search?q={aranacakKelime}`
- **Query Parameters:** 
  - `q` (string, required) - Aranacak kelime
- **Authentication:** Gerekli değil
- **Response:** `200 OK` - Arama terimi ile eşleşen ilanlar döndürülür

## 10. Vitrin İlanlarını Görüntüleme
- **Endpoint:** `GET /listings/showcase`
- **Authentication:** Gerekli değil
- **Response:** `200 OK` - Ana sayfada gösterilecek güncel vitrin ilanları döndürülür