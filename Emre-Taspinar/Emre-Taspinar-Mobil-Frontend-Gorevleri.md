# Emre Taşpınar'ın Mobil Frontend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek]

## 1. İlan Ekleme Ekranı
- **Dosya:** `mobile/app/add-listing.tsx`
- **Görev:** Form yönetimi (TextInput) ve klavyenin form üstüne binmesini engelleyen `KeyboardAvoidingView` entegrasyonu.

## 2. Fotoğraf Yükleme ve Galeri Erişimi
- **Dosya:** `mobile/app/add-listing.tsx`
- **Görev:** `expo-image-picker` ile cihaz kütüphanesinden resim seçimi ve resimlerin `FormData` objesine dönüştürülüp backend'e gönderilmesi.

## 3. İlan Detay Ekranı
- **Dosya:** `mobile/app/listing/[id].tsx`
- **Görev:** Seçilen ilanın fotoğraflarını saydırılabilir galeri (Carousel) mantığıyla büyük ekranda göstermek.

## 4. Benim İlanlarım Ekranı
- **Dosya:** `mobile/app/my-ads.tsx`
- **Görev:** Kullanıcının sadece kendine ait yüklediği ilanları özel bir ekranda görüp yönetebilmesi.

## 5. Kendi İlanını Silme İşlemi (Optimistic UI)
- **Görev:** Benim ilanlarım ekranında silme butonuna basıldığında, kullanıcıya Alert (Onay) çıkartılıp ilanın backend üzerinden silinmesi.

## 6. İlan Güncelleme Formu
- **Görev:** İlan sahibinin yayındaki ilan bilgilerini düzenleyebileceği arayüzün form mantığının kurulması.