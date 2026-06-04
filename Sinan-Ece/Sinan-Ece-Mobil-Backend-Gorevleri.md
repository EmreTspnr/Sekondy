#Sinan Ece'nin Mobil Backend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek]

## 1. Satıcıyı Takip Etme
- **API Endpoint:** `POST /users/:sellerId/follow` veya `/follows`
- **Görev:** Kullanıcının güvendiği satıcının ID'sini kendi veritabanındaki takip edilenler (followed) listesine `$addToSet` ile eklemesi.

## 2. Arama Kriterlerini Kaydetme
- **API Endpoint:** `POST /saved-searches`
- **Görev:** Kullanıcının aradığı anahtar kelime veya kategorinin `SavedSearch` koleksiyonuna yazılması. `RabbitMQ` kuyruğuna Yeni Arama mesajı bırakılması.

## 3. Arama Bildirimlerini Açma/Kapatma
- **API Endpoint:** `PUT /saved-searches/:searchId/notifications`
- **Görev:** Kullanıcının bildirim tercihlerinin (notificationsEnabled) Boolean olarak güncellenmesi.

## 4. Kayıtlı Aramayı Silme
- **API Endpoint:** `DELETE /saved-searches/:searchId`
- **Görev:** Takip etmekten vazgeçilen kelimenin veritabanından kaldırılması.

## 5. Kategoriye Göre İlan Listeleme
- **API Endpoint:** `GET /ads?category={categoryName}`
- **Görev:** `ListingController` içinde kategori parametresine göre Mongoose arama filtresi oluşturarak hedef ilanları getirme.

## 6. Vitrin İlanlarını Görüntüleme
- **API Endpoint:** `GET /ads` (Showcase)
- **Görev:** Platform ana sayfasına en son yayınlanan vitrin ilanlarının performanslı (Redis destekli) dönülmesi.