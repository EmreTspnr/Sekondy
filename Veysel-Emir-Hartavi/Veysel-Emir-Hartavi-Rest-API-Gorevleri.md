# Veysel Emir Hartavi'nin REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](https://youtu.be/1pRfl8u8cFE)

## 1. İlan Şikayet Etme
- **Endpoint:** `POST /listings/{listingId}/reports`
- **Path Parameters:** 
  - `listingId` (string, required) - Şikayet edilecek ilanın ID'si
- **Request Body:** 
  ```json
  {
    "reason": "Bu ilan sahte resimler ve bilgiler içermektedir."
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - İlan başarıyla şikayet edildi

## 2. İlan Durumunu Onaylama
- **Endpoint:** `PUT /admin/listings/{listingId}/approve`
- **Path Parameters:** 
  - `listingId` (string, required) - Onaylanacak ilanın ID'si
- **Authentication:** Bearer Token gerekli (Yalnızca Yönetici)
- **Response:** `200 OK` - İlan başarıyla onaylandı (Yayına alındı durumu aktifleşir)

## 3. Kullanıcı Hesabını Askıya Alma
- **Endpoint:** `PUT /admin/users/{userId}/suspend`
- **Path Parameters:** 
  - `userId` (string, required) - Askıya alınacak kullanıcının ID'si
- **Authentication:** Bearer Token gerekli (Yalnızca Yönetici)
- **Response:** `200 OK` - Kullanıcı hesabı askıya alındı (Girişi engellendi)

## 4. Uygunsuz İlanı Silme
- **Endpoint:** `DELETE /admin/listings/{listingId}`
- **Path Parameters:** 
  - `listingId` (string, required) - Silinecek ilanın ID'si
- **Authentication:** Bearer Token gerekli (Yalnızca Yönetici)
- **Response:** `200 OK` - İlan sistemden tamamen silindi

## 5. Onay Bekleyen İlanları Listeleme
- **Endpoint:** `GET /admin/listings/pending`
- **Authentication:** Bearer Token gerekli (Yalnızca Yönetici)
- **Response:** `200 OK` - Sisteme yeni eklenen ve incelenmeyi (onay) bekleyen ilanlar doldurulur

## 6. Şikayet Edilen İlanları Listeleme
- **Endpoint:** `GET /admin/listings/reported`
- **Authentication:** Bearer Token gerekli (Yalnızca Yönetici)
- **Response:** `200 OK` - Kullanıcılar tarafından şikayet edilen tüm ilanlar şikayet nedenleri ile listelenir