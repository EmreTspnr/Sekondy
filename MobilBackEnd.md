# Mobil Backend (REST API Bağlantısı) ve Entegrasyon Yapısı

Bu dokümanda, Sekondy mobil uygulamasının (React Native) arka plandaki Node.js REST API ile olan iletişim mimarisi, uç noktaları ve bağlantı prensipleri detaylandırılmıştır.

---

## Grup Üyelerinin Mobil Backend Görevleri

1. [Emre Taşpınar'ın Mobil Backend Görevleri](Emre-Taspinar/Emre-Taspinar-Mobil-Backend-Gorevleri.md)
2. [Furkan Sarıbaş'ın Mobil Backend Görevleri](Furkan-Saribas/Furkan-Saribas-Mobil-Backend-Gorevleri.md)
3. [Veysel Emir Hartavi'nin Mobil Backend Görevleri](Veysel-Emir-Hartavi/Veysel-Emir-Hartavi-Mobil-Backend-Gorevleri.md)
4. [Sinan Ece'nin Mobil Backend Görevleri](Sinan-Ece/Sinan-Ece-Mobil-Backend-Gorevleri.md)
5. [Ramize Elif Ermiş'in Mobil Backend Görevleri](Ramize-Elif-Ermis/Ramize-Elif-Ermis-Mobil-Backend-Gorevleri.md)

---

## 1. HTTP Client ve Axios Yapılandırması

Mobil uygulama, backend ile iletişim için özelleştirilmiş bir `Axios` nesnesi kullanır (`services/api.ts`).

- **Base URL:** Mobil cihazda yerel geliştirmeyi desteklemek için IP bazlı bir URL (örn: `http://192.168.1.X:3000/api/v1`) kullanılmaktadır. Canlı ortama çıkıldığında (production) ana URL'e dönüşecektir.
- **Interceptor Mimarisi:** 
  - **Request (İstek):** Uygulama her API isteği yaptığında `AsyncStorage` içinde kayıtlı olan JWT token'ı arar. Bulursa `Authorization: Bearer <token>` başlığını otomatik olarak tüm isteklere ekler. Böylece sayfalarda manuel token gönderme işlemi ortadan kaldırılmıştır.

## 2. Temel API Uç Noktaları (Endpoints)

Mobil uygulama aşağıdaki endpoint gruplarını yoğun olarak kullanmaktadır:

### Authentication (Kimlik Doğrulama)
- `POST /auth/register`: Yeni üye kaydı.
- `POST /auth/login`: Sisteme giriş yapma ve JWT token alma.
- `POST /auth/push-token`: Mobil cihazın (iOS/Android) bildirim alabilmesi için üretilen "Expo Push Token"ı kullanıcının veritabanı profiline kaydeder.

### İlanlar (Listings / Ads)
- `GET /ads`: Vitrin için ilanları getirir (kategori ve arama sorguları içerir).
- `GET /ads/:id`: Tekil ilan detayını çeker.
- `POST /ads`: Yeni ilan ekler. (Resim yüklemelerinde `multipart/form-data` kullanılarak fotoğraf dosyaları gönderilir).
- `PUT /ads/:id` & `DELETE /ads/:id`: Kullanıcının kendi ilanını güncellemesi/silmesi.

### Etkileşimler (Favoriler, Aramalar, Takip)
- `GET`, `POST`, `DELETE /favorites`: Favori ilan yönetimi.
- `GET`, `POST`, `DELETE /saved-searches`: Kayıtlı aramaların eklenip listelenmesi. (Push notification ayarlamaları `PUT /saved-searches/:id/notifications` üzerinden yapılır).
- `GET`, `POST`, `DELETE /follows`: Belirli bir satıcıyı takip etme ve takibi bırakma.

### Sohbet (Mesajlaşma)
- `GET /messages`: Kullanıcının tüm mesajlaştığı kişileri ve sohbetleri gruplayarak getirir.
- `GET /messages/partner/:id`: Belirli bir kişiyle olan mesaj geçmişini getirir.
- `POST /messages`: Yeni bir mesaj gönderir. (Gönderildiğinde karşı tarafa anında "Push Notification" tetiklenir).

### Yönetici (Admin)
- `GET /admin/ads/pending`: Onay bekleyen ilanların listesini çeker. (Aşağı çekerek yenileme ile Redis önbelleğinden bağımsız güncel veri alınır).
- `GET /admin/reports`: Şikayet edilen ilanların listesi.
- `PUT /admin/ads/:id/approve` & `DELETE /admin/ads/:id/reject`: İlan onaylama/reddetme mekanizması.

## 3. Push Notification (Bildirim) Altyapısı

Sistem, anlık bildirim göndermek için Node.js'in çekirdek `https` kütüphanesini kullanarak `exp.host/--/api/v2/push/send` Expo uç noktasına doğrudan istek atar. 
- Sunucuda herhangi bir "fetch" bağımlılığına (`node-fetch` veya `axios`) ihtiyaç duyulmaz. (Server 500 hatalarını engeller).
- Bir kullanıcıya **mesaj gönderildiğinde** veya **kayıtlı aramasına uyan bir ilan düştüğünde**, backend bu kişinin `expoPushToken` değerini okur ve telefonuna doğrudan donanımsal (titreşimli) bildirim fırlatır.

## 4. Caching ve State Senkronizasyonu
- Mobil uygulamada sayfa geçişleri sırasında veri bayatlamasını engellemek için, ekranlara her odaklanıldığında (`useFocusEffect` kancası) veya listeler "aşağı çekildiğinde" (`RefreshControl`) backend'e tekrar istek atılır.
- Backend, ağır liste sorgularını (vitrin vb.) 10 dakika boyunca Redis'te (`redis.get`, `redis.set`) tutar. Ancak yeni bir ilan onaylandığında veya şikayet edildiğinde sistem otomatik olarak `redis.del()` ile cache'i temizler ki mobil uygulamadaki adminler ve kullanıcılar her daim anlık veriyi görebilsin.
