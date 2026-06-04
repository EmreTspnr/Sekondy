# Emre Taşpınar'ın Mobil Backend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek]

## 1. Yeni İlan Ekleme
- **API Endpoint:** `POST /ads` (Projedeki karşılığı)
- **Görev:** Kullanıcının başlık, fiyat, kategori gibi temel ilan bilgilerini Mongoose veritabanına `pending` statüsüyle kaydetmesi.

## 2. İlana Fotoğraf Yükleme
- **API Endpoint:** `POST /ads/:id/photos`
- **Görev:** Multer kütüphanesi kullanılarak multipart/form-data ile yüklenen görsellerin disk storage'a yazılması ve ilan objesine bağlanması.

## 3. İlan Bilgilerini Güncelleme
- **API Endpoint:** `PUT /ads/:id`
- **Görev:** İlan sahibinin yayındaki ilanının fiyat ve detaylarını sonradan güncelleyebilmesi. (Owner yetki kontrolü ile)

## 4. İlan Detaylarını Görüntüleme
- **API Endpoint:** `GET /ads/:id`
- **Görev:** Herkesin erişimine açık olan bu uç nokta üzerinden, satıcı bilgileriyle (Populate) ilanın tüm detaylarının döndürülmesi.

## 5. İlanı Silme
- **API Endpoint:** `DELETE /ads/:id`
- **Görev:** İlan sahibinin veya adminin bir ilanı veritabanından kalıcı olarak temizlemesi.

## 6. Kendi İlanlarını Listeleme
- **API Endpoint:** `GET /ads/my-ads` (Projedeki karşılığı)
- **Görev:** Sadece oturum açmış kullanıcının kendine ait aktif/pasif ilanlarını toplu liste halinde getirmesi.