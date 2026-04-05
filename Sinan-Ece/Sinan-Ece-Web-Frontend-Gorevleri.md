# Sinan Ece'nin Web Frontend Görevleri
**Web Front-end Demo Videosu:** [https://youtu.be/ogyRzV6vKuU]
Bu dokümanda Sinan Ece'nin odaklandığı listeleme, arama ve vitrin fonksiyonlarına ait UI/UX sorumlulukları listelenmiştir. (Gereksinimler 13-18)

## 1. Satıcıyı Takip Etme Sistemi
- **Gereksinim:** `POST /users/:userId/follow` entegrasyonu
- **UI Bileşenleri:** İlan sayfalarında ve kullanıcı profillerinde bulunan "Takip Et" / "Takibi Bırak" butonu (Toggle işlevi).
- **Kullanıcı Deneyimi:** "Optimistic UI Update" ile butona basıldığı an apiden cevap beklemeden butonun (Takip Ediliyor) moduna geçmesi. Micro animasyon efektleri.
- **Teknik Detaylar:** `useState` ile buton durumu geçişlerinin yönetimi ve catch() içerisinden geri alınması.

## 2. Arama Kriterlerini Kaydetme
- **Gereksinim:** `POST /saved-searches` entegrasyonu
- **UI Bileşenleri:** Arama yapılarak sonuç alınan ekranlarda görülen "Bu Aramayı Kaydet" alert butonu ve kayıt isminin istendiği küçük Pop-up Dialog.
- **Kullanıcı Deneyimi:** Girilen arama keywordlerinin otomatik yakalanması; kullanıcıya ekstra filtre sordurmadan kayıt imkanı sunulması.
- **Teknik Detaylar:** React Router'in `useSearchParams` hook'undan query'lerin parse edilip backend isteğine dönüştürülmesi.

## 3. Arama Bildirimlerini Açma
- **Gereksinim:** `PUT /saved-searches/:searchId/notifications` entegrasyonu
- **UI Bileşenleri:** Kayıtlı aramalar panosundaki her bir listenin yanına Switch Toggle veya Çan(Bell) İkonu eklenmesi.
- **Kullanıcı Deneyimi:** Seçildiği zaman ikonun aktif renge dönmesi ve Switch kaydırmasının pürüzsüz framer motion transitionlarına sahip olması.
- **Teknik Detaylar:** Form control elemanı dizaynlarında Tailwind kullanımı.

## 4. Kayıtlı Aramayı Silme
- **Gereksinim:** `DELETE /saved-searches/:searchId` entegrasyonu
- **UI Bileşenleri:** Profilim > "Kayıtlı Aramalar" sayfası. Her kaydın en sağında yer alan küçük Trash/Çöp Kutusu butonu.
- **Kullanıcı Deneyimi:** Listedeki kaydın fade-out efekti ile akıcı biçimde kaybolması.
- **Teknik Detaylar:** Array filtering (`filter()` iterasyonu) yöntemiyle listeyi state üzerinden DOM listesinde yok etme.

## 5. Kategoriye Göre İlan Listeleme Navigasyonu
- **Gereksinim:** `GET /ads/category/:categoryId` entegrasyonu
- **UI Bileşenleri:** Sol menü sidebar ya da üst top-bar sekme sistemi. Gelişmiş Breadcrumb yapısı (Anasayfa > Vasıta > Otomobil vb.).
- **Kullanıcı Deneyimi:** Kategori seçildikçe ürün listesi ekranının `loader` arayüzüne girerek re-renderlanması; URL ile kategorize uyumunun takibi.
- **Teknik Detaylar:** `useParams` aracılığı ile path URL den Kategori Id'sinin yakalanması ve API tetiklemesi. Boş state mimarisi.

## 6. Vitrin İlanlarını Görüntüleme (Ana Sayfa)
- **Gereksinim:** `GET /ads/showcase` entegrasyonu
- **UI Bileşenleri:** Zengin görsel barındıran, sayfa odaklı Anasayfa Vitrin bileşeni (Carousel/Swiper Slider) ve Grid tabanlı popüler ilanlar bölümü.
- **Kullanıcı Deneyimi:** Ekranda (mobil touch dahil) kaydırılabilir (swipeable) galeri mimarisi; etkileşim artırıcı hover kart efektif dizaynı.
- **Teknik Detaylar:** Vite sisteminde performansı artırmak adına Carousel asset'lerinin Lazy Loading metodu ile sayfaya dahil edilmesi.