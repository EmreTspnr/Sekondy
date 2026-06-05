# Veysel Emir Hartavi'nin Mobil Backend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek]

## 1. İlan Şikayet Etme
- **API Endpoint:** `POST /listings/:listingId/reports`
- **Görev:** Yanıltıcı ilanın `Report` koleksiyonuna rapor eden kişiyle (populate) beraber eklenmesi.

## 2. İlan Durumunu Onaylama
- **API Endpoint:** `PUT /admin/ads/:listingId/approve`
- **Görev:** İlanı `pending` halinden `approved` haline geçirmek. Ekstra İşlev: Arama Bildirimlerini (Push Notification) onay anında tetiklemek.

## 3. Kullanıcı Hesabını Askıya Alma
- **API Endpoint:** `PUT /admin/users/:userId/suspend`
- **Görev:** Yöneticinin, platformu kötüye kullanan bir kullanıcının yetkilerini kısıtlaması. (Yetki middleware kurguları).

## 4. Uygunsuz İlanı Silme / Reddetme
- **API Endpoint:** `DELETE /admin/ads/:listingId` veya `/reject`
- **Görev:** Yönetici yetkisi kullanılarak kural ihlali yapan ilanın kalıcı olarak temizlenmesi veya reddedilmesi.

## 5. Onay Bekleyen İlanları Listeleme
- **API Endpoint:** `GET /admin/ads/pending`
- **Görev:** Sadece yöneticilerin erişebildiği bu serviste henüz yayına girmemiş yeni ilanların getirilmesi. Redis önbelleğinin temizlenmesi (`redis.del('admin:pendingAds')`).

## 6. Şikayet Edilen İlanları Listeleme
- **API Endpoint:** `GET /admin/reports`
- **Görev:** İhbar edilmiş ilanların, sebepleriyle birlikte liste halinde admin paneline gönderilmesi.