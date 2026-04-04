# Veysel Emir Hartavi'nin Web Frontend Görevleri

Bu dokümanda Veysel Emir Hartavi'nin geliştireceği Admin Panel yapısı ve güvelik/şikayet sistemleri ele alınmaktadır. (Gereksinimler 25-30)

## 1. İlan Şikayet Etme
- **Gereksinim:** `POST /reports` entegrasyonu (Kullanıcı Tarafı Akışı)
- **UI Bileşenleri:** Normal kullanıcıların gördüğü ilan sayfası içerisindeki "Şikayet Et" linki ve buna bağlı Modal Formu. Şikayet nedenleri Checkbox veya Dropdown'u.
- **Kullanıcı Deneyimi:** Şikayetin formu doldurulduktan hemen sonra "Bildiriminiz ulaşmıştır, teşekkürler" bilgilendirmesi ile kullanıcının bilgilendirilip yönlendirilmesi.
- **Teknik Detaylar:** Basit Select Native veya kütüphane componentleri kullanarak veriyi JSON bazlı hazırlama ve gönderme.

## 2. İlan Durumunu Onaylama (Admin Paneli)
- **Gereksinim:** `PUT /admin/ads/:adId/approve` entegrasyonu
- **UI Bileşenleri:** Admin kontrol panelinde "Onay Bekleyenler" tablosunda yer alan yeşil işaret renkli pratik "Yayına Al / Onayla" aksiyon düğmesi.
- **Kullanıcı Deneyimi:** Düğmeye tıklandıktan sonra ilgili satırın pürüzsüz animasyonla kaybolarak bekleyenler kuyruğundan arındırılması.
- **Teknik Detaylar:** Yönetici temalı layoutlar ve tablo state statik yönetimi.

## 3. Kullanıcı Hesabını Askıya Alma (Admin)
- **Gereksinim:** `PUT /admin/users/:userId/suspend` entegrasyonu
- **UI Bileşenleri:** Sistem Üye Listesi ekranında üyeye ait özellikler panelinde bulunan "Hesabı Durdur/Kapat" tehlike uyarı seviyeli buton.
- **Kullanıcı Deneyimi:** İşlemin geçerli kılınması için sebebi belirten bir textarea onayı barındıran Modal penceresi çıkması ve emin misiniz sorusu eklenmesi.
- **Teknik Detaylar:** Yüksek dereceli yetki (Admin Role) kısıtlamasına sahip React Router v7 Private/Admin Route component guard kurgusu tasarımı.

## 4. Uygunsuz İlanı Silme (Admin)
- **Gereksinim:** `DELETE /admin/ads/:adId` entegrasyonu
- **UI Bileşenleri:** Şikayet edilmiş veya incelemeden geçemeyen ihlalli ilanların tamamen imhası amaçlı kurgulanan "Toplu Sil" ya da "Tekil Sil" (Drop) butonları.
- **Kullanıcı Deneyimi:** Listelerde silme yapıldığında UI yapısının ve toplam gösterge (statistic count) sayılarının da eş zamanlı azalarak düşürülmesi.
- **Teknik Detaylar:** Delete requesti sonrasında Redux veya Context API kullanılıyorsa ana rakam verilerinin invalidate edilip sayfanın verilerinde güvenilirlik sağlanması.

## 5. Onay Bekleyen İlanları Listeleme (Admin)
- **Gereksinim:** `GET /admin/ads/pending` entegrasyonu
- **UI Bileşenleri:** Admin dashboard üstünde bol veri işleyebilecek (Data table) arayüz tasarımı. Kategori ve tarih filtreleme componentleri.
- **Kullanıcı Deneyimi:** Çok fazla data birikmesi durumlarda UI tıkanıklığını önleyecek sayfalama (Pagination) buton dizisi tasarımı. Data Table yapısı içerisinde hızlı search box.
- **Teknik Detaylar:** API tarafında dönen limit ve offset yapılarını okuyup, client tarafında pagination state modeline giydirilmesi.

## 6. Şikayet Edilen İlanları Listeleme (Admin)
- **Gereksinim:** `GET /admin/reports` entegrasyonu
- **UI Bileşenleri:** Onay bekleyen listesinden daha detaylı; şikayet eden, sebebi ve ilanın detayını gruplayarak veren geniş arayüz tasarımı.
- **Kullanıcı Deneyimi:** Şikayet açıklamasını okumak zorunda kalmamak için tablo hücrelerinde üzerine gelindiğinde beliren (Tooltip) bilgi kutucuklarının optimize edilmesi.
- **Teknik Detaylar:** Kompleks objelerin React map'lemesiyle içe doğru render taktiklerinin (composition pattern) kullanımı. Tailwind yardımıyla admin ekran stili.