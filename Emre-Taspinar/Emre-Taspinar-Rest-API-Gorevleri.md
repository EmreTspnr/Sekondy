# Emre Taspınar'ın REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. İlan Ekleme
- **Endpoint:** `POST /listings`
- **Request Body:** 
  ```json
  {
    "title": "Sahibinden Temiz iPhone 13",
    "price": 25000,
    "category": "Elektronik",
    "listingType": "Satılık",
    "condition": "İkinci El",
    "summary": "Sorunsuz, az kullanılmış iPhone 13.",
    "description": "Cihazın hiçbir sorunu yoktur, ilk günkü gibi temizdir. Garantisi devam etmektedir.",
    "location": "İstanbul, Kadıköy"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - İlan başarıyla oluşturuldu

## 2. İlana Fotoğraf Yükleme
- **Endpoint:** `POST /listings/{id}/photos`
- **Path Parameters:** 
  - `id` (string, required) - İlan ID'si
- **Request Body:** `multipart/form-data`
  - `photos`: Resim dosyalarınız (Maksimum 5 dosya, desteklenen formatlar: jpg, jpeg, png, webp)
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Fotoğraflar eklendi

## 3. İlan Bilgilerini Güncelleme
- **Endpoint:** `PUT /listings/{id}`
- **Path Parameters:** 
  - `id` (string, required) - İlan ID'si
- **Request Body:** 
  ```json
  {
    "price": 24000,
    "condition": "İkinci El",
    "summary": "Fiyat düştü, acil satılık!"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - İlan başarıyla güncellendi

## 4. İlan Detaylarını Görüntüleme
- **Endpoint:** `GET /listings/{id}`
- **Path Parameters:** 
  - `id` (string, required) - İlan ID'si
- **Authentication:** Gerekli değil (Herkes görebilir)
- **Response:** `200 OK` - İlan bilgileri başarıyla getirildi

## 5. İlanı Silme
- **Endpoint:** `DELETE /listings/{id}`
- **Path Parameters:** 
  - `id` (string, required) - İlan ID'si
- **Authentication:** Bearer Token gerekli (Sadece ilan sahibi veya yönetici silebilir)
- **Response:** `200 OK` - İlan başarıyla sistemden kaldırıldı

## 6. Kendi İlanlarını Listeleme
- **Endpoint:** `GET /my-listings`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - İlanlar başarıyla getirildi, kullanıcının ilan listesi dizi formatında döndürülür