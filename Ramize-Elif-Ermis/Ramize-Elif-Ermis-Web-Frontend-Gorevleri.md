# Ramize Elif Ermiş'in Web Frontend Görevleri
**WEB Front-end Demo Videosu:** [https://youtu.be/tauYLG6zWP4]
Bu dokümanda Ramize Elif Ermiş'in sahip olduğu mesajlaşma akışı ve favori ilan yönetim ekranları sorumlulukları listelenmiştir. (Gereksinimler 19-24)

## 1. Satıcıya Mesaj Gönderme
- **Gereksinim:** `POST /messages` entegrasyonu
- **UI Bileşenleri:** İlan detay ekranında bulunan "Satıcıya Soru Sor" Modal penceresi ve ilgili textarea form mesaj kutusu.
- **Kullanıcı Deneyimi:** Açılır bir popup Modal formu (sayfadan koparmadan iletişim sağlayan UI yapısı). Gönderildi ibaresi (Success State). Minimum/Maksimum karakter limitleme ve sayacı.
- **Teknik Detaylar:** React hook `useState` aracılığı ile mesaj text bilgisinin form denetimi.

## 2. İlanı Favorilere Ekleme
- **Gereksinim:** `POST /favorites` entegrasyonu
- **UI Bileşenleri:** İlan kartı üzerinde bulunan Kalp ikon bileşeni.
- **Kullanıcı Deneyimi:** İkon favoride olmayanlar için border ile (HeartOutline), olanlar için tam dolu ve kırmızı (HeartSolid) renkte olmasıdır. Tıklandığında minyatür "Büyü/Küçül" pump mikro-animasyonu eklenmesi.
- **Teknik Detaylar:** `Lucide React` kütüphanesi ikonlarının Local state ile toggle sistemine entegresi ve backend senkronizasyonu.

## 3. Mesajı Okundu İşaretleme
- **Gereksinim:** `PUT /messages/:messageId/read` entegrasyonu
- **UI Bileşenleri:** Okunmamış mesaj listesinin sol tarafında "Unread" mavi nokta (badge) gösterimi. Tıklanıp kapatıldığında bu noktanın sönmesi.
- **Kullanıcı Deneyimi:** Yazı tiplerinde okunan mesajı normal(font-normal), okunmayanı kalın(font-bold) vurgulama stili.
- **Teknik Detaylar:** onClick event listener üzerinden api request fırlatılması.

## 4. Gelen Mesajı Silme
- **Gereksinim:** `DELETE /messages/:messageId` entegrasyonu
- **UI Bileşenleri:** Gelen kutusunda yer alan her mesaj listesi bileşeninin detay sayfasında veya Context menüsündeki "Mesajı Sil" (Trash) aksiyon ikonu.
- **Kullanıcı Deneyimi:** Mesajın yanal bir Transition hareketiyle ekranı terk etmesi.
- **Teknik Detaylar:** İlgili elementin ID değeri baz alınarak silinecek verinin API ye yollanması ve başarılı yanıttan sonra State'in temizlenmesi.

## 5. Gelen Mesajları Listeleme (Inbox)
- **Gereksinim:** `GET /messages` entegrasyonu
- **UI Bileşenleri:** Çoklu panele sahip Gelen Kutusu Layout'u (Örn Sol sütun mesaj odaları listesi, Sağ Sütun sohbet ekranı paneli).
- **Kullanıcı Deneyimi:** Sohbet paneli geçmişinin scroll ile rahat takibi; listelemelerin modern sohbet arayüzlerinde (Whatsapp Web, Telegram) olduğu gibi tasarlanması.
- **Teknik Detaylar:** Polling mimarisiyle veya sadece basit `useEffect` fetch yapısı kullanılması; verilerin tarihe (Dün, 12:45 vb.) pars edilmesi.

## 6. Favori İlanları Listeleme
- **Gereksinim:** `GET /favorites` entegrasyonu
- **UI Bileşenleri:** Kullanıcının beğendiği ilanları saklayan özel sayfa dizaynı (Grid view).
- **Kullanıcı Deneyimi:** Favorideki ürünlerin stok durumu veya silinmiş olduğu durumlarda pasifleşmesi, Overlay (Bu ilan yayından kalktır) görsel uyarısı. Üst köşesinde "X" butonu ile çabuk kaldırma yeteneği.
- **Teknik Detaylar:** Axios verisinin standart Card componentlerine prop drill yoluyla beslenmesi.