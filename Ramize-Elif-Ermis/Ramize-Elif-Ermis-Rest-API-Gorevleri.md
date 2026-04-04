# Ramize Elif Ermiş'in REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Satıcıya Mesaj Gönderme
- **Endpoint:** `POST /messages`
- **Request Body:** 
  ```json
  {
    "receiverId": "65bfa2c10f3c5f401234abcd",
    "listingId": "65bfa3d50f3c5f405678efgh",
    "content": "Merhaba, ürün hala satılık mı?"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Mesaj başarıyla gönderildi

## 2. İlanı Favorilere Ekleme
- **Endpoint:** `POST /favorites`
- **Request Body:** 
  ```json
  {
    "listingId": "65bfa3d50f3c5f405678efgh"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - İlan favorilere eklendi

## 3. Mesajı Okundu İşaretleme
- **Endpoint:** `PUT /messages/{messageId}/read`
- **Path Parameters:** 
  - `messageId` (string, required) - Mesaj ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Mesaj okundu olarak işaretlendi

## 4. Mesaj Silme (Gelen veya Giden)
- **Endpoint:** `DELETE /messages/{messageId}`
- **Path Parameters:** 
  - `messageId` (string, required) - Mesaj ID'si
- **Authentication:** Bearer Token gerekli (Sadece mesajın alıcısı veya göndericisi silebilir)
- **Response:** `200 OK` - Mesaj başarıyla silindi (Kullanıcı tarafı için gizlenir)

## 5. Mesajları Listeleme
- **Endpoint:** `GET /messages`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının gelen ve giden aktif mesajları (silinmemiş olanlar) döndürülür

## 6. Favori İlanları Listeleme
- **Endpoint:** `GET /favorites`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcının favoriye aldığı ilanlar tarih sırasına göre döndürülür

## 7. İlanı Favorilerden Çıkarma
- **Endpoint:** `DELETE /favorites/{id}`
- **Path Parameters:** 
  - `id` (string, required) - Favori Kayıt ID'si (İlan ID değil, favori ilişkisinin ID'si)
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - İlan favorilerden başarıyla kaldırıldı