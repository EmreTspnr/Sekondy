# Emre Taşpınar'ın Web Frontend Görevleri

Bu dokümanda Emre Taşpınar'ın sorumluluğunda olan ilan oluşturma ve detay fonksiyonları detaylandırılmıştır. (Gereksinimler 7-12)

## 1. Yeni İlan Ekleme Modülü
- **Gereksinim:** `POST /ads` entegrasyonu
- **UI Bileşenleri:** Multi-step (çok adımlı) zengin veri formu (Kategori seçimi, açıklama, başlık, mülk özellikleri vb.).
- **Kullanıcı Deneyimi:** Form adımlarında ilerleme çubuğu (Progress bar). Formda eksik bir alan bırakıldığında input altında kırmızı odaklı uyarılar ve engelleyici kontroller.
- **Teknik Detaylar:** React Native state yönetimi ile multi-step form mimarisinin kurulması. Kategori API beslemeleri.

## 2. İlana Fotoğraf Yükleme Komponenti
- **Gereksinim:** `POST /ads/:adId/photos` entegrasyonu
- **UI Bileşenleri:** İlan verme sayfasında sürükle-bırak (Drag & Drop) özellikli fotoğraf upload alanı ve imaj galerisi kartları.
- **Kullanıcı Deneyimi:** Yüklenen resmin küçük önizlemesinin (preview) yapılması, yüklenme progress bar animasyonları ve "Sil (X)" butonu.
- **Teknik Detaylar:** JS objesi olarak File API, `FormData` kullanımı ile resimlerin asenkron olarak Node backend servisine gönderilmesi.

## 3. İlan Bilgilerini Güncelleme Ekranı
- **Gereksinim:** `PUT /ads/:adId` entegrasyonu
- **UI Bileşenleri:** Eski değerlerin inputlarına pre-fill yapıldığı düzenleme kontrol modülü ve paneli.
- **Kullanıcı Deneyimi:** Yalnızca belirli bir veride değişiklik (dirty state) algılandığında Kaydet butonunun enable olması (yeşile dönmesi).
- **Teknik Detaylar:** React `useEffect` kullanılarak ilan verisinin `GET` isteği ile alınıp initial form state'ine senkronize edilmesi.

## 4. İlan Detaylarını Görüntüleme Arayüzü
- **Gereksinim:** `GET /ads/:adId` entegrasyonu
- **UI Bileşenleri:** Büyük ilan kapak fotoğrafı, alt slider resim galerisi, fiyat tag'leri ve zengin açıklama blokları. Satıcı kontakt bilgileri.
- **Kullanıcı Deneyimi:** Kullanıcı resimler arasında oklarla geçiş sağlayabilmeli (Slider özelliği). Karmaşık özelliklerin ferah Grid layout'una yayılması.
- **Teknik Detaylar:** `useParams` ile React Router v7 üstünden ilan ID tutularak sayfaya getirilmesi. Skeleton loading arayüzü kontrolü.

## 5. İlanı Silme İşlemi
- **Gereksinim:** `DELETE /ads/:adId` entegrasyonu
- **UI Bileşenleri:** "İlanı Yayından Kaldır" tehlike seviyeli kırmızı buton. Tıklanınca açılan uyarı Modal/Dialog kutusu.
- **Kullanıcı Deneyimi:** Yanlış kullanım ve kazaları engellemek için geri dönüşü bulunmayan işlemlerde "Emin misiniz" teyid kutusu.
- **Teknik Detaylar:** DELETE sorgusu başarılı olduktan hemen sonra "İlanlarım" listesinin state filtering yardımıyla anında refresh olmasını sağlama.

## 6. Kendi İlanlarını Listeleme ("İlanlarım")
- **Gereksinim:** `GET /my-ads` entegrasyonu
- **UI Bileşenleri:** Grid tabanlı yatay (horizontal) özel liste veya detaylı bir tablo.
- **Kullanıcı Deneyimi:** Resim, satış durumu, görüntülenme sayısı gibi temel ön bilgileri barındıran özet kart tasarımı. "İlan Yok" boş alan durumu dizaynı.
- **Teknik Detaylar:** Bileşen içi state'lerde listenin manipülasyonu. Axios hook adaptasyonları.