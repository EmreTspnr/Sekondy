# Mobil Frontend Görev Dalımı ve Mimari Yapısı (Sekondy)

## Grup Üyelerinin Mobil Frontend Görevleri

1. [Emre Taşpınar'ın Mobil Frontend Görevleri](Emre-Taspinar/Emre-Taspinar-Mobil-Frontend-Gorevleri.md)
2. [Furkan Sarıbaş'ın Mobil Frontend Görevleri](Furkan-Saribas/Furkan-Saribas-Mobil-Frontend-Gorevleri.md)
3. [Veysel Emir Hartavi'nin Mobil Frontend Görevleri](Veysel-Emir-Hartavi/Veysel-Emir-Hartavi-Mobil-Frontend-Gorevleri.md)
4. [Sinan Ece'nin Mobil Frontend Görevleri](Sinan-Ece/Sinan-Ece-Mobil-Frontend-Gorevleri.md)
5. [Ramize Elif Ermiş'in Mobil Frontend Görevleri](Ramize-Elif-Ermis/Ramize-Elif-Ermis-Mobil-Frontend-Gorevleri.md)

---

Bu dokümanda, Sekondy mobil uygulamasının kullanıcı arayüzü (UI), kullanıcı deneyimi (UX) mimarisi ve Expo altyapısı ile tasarlanmış ekranları detaylandırılmaktadır. Uygulama **React Native**, **Expo** ve **Expo Router** (File-based Routing) kullanılarak geliştirilmiştir.

---

## 1. Uygulama İçi Sayfalar ve Ekranlar (Screens)

- **Vitrin (Ana Ekran) `(tabs)/index.tsx`:** Kullanıcıların tüm ilanları kategoriye göre filtreleyip gördüğü, arama yapabildiği ve aramaları kaydedebildiği ana ekran. Pull-to-refresh (Aşağı çekerek yenileme) mevcuttur.
- **İlan Detay `listing/[id].tsx`:** İlanın fotoğrafları (slider), başlığı, fiyatı, satıcı bilgileri ve iletişim/favori butonlarının bulunduğu detay sayfası.
- **İlan Ekle/Düzenle `add-listing.tsx` & `edit-listing/[id].tsx`:** FormData ile çoklu fotoğraf yüklenebilen, zorunlu alan doğrulaması (validation) içeren ilan yönetim sayfaları.
- **Mesajlar `(tabs)/messages.tsx` & `chat/[id].tsx`:** Kullanıcıların birbirleriyle mesajlaştığı, okunmamış bildirim sayılarının göründüğü sohbet arayüzü.
- **Profil `(tabs)/profile.tsx`:** Kullanıcının hesap istatistiklerini görebildiği, hesabını silebildiği ve çıkış yapabildiği ekran.
- **İlanlarım `(tabs)/my-ads.tsx`:** Kullanıcının kendi ilanlarını görüp silebildiği/düzenleyebildiği liste ekranı.
- **Favoriler `(tabs)/favorites.tsx`:** Favoriye alınan ilanların tutulduğu ve hızlıca silinebildiği sayfa.
- **Kayıtlı Aramalar `saved-searches.tsx`:** İstenilen arama filtrelerinin kaydedilip, yeni ilan düşmesi durumunda anında haberdar olmak için bildirim (push) ayarlarının yönetildiği ekran.
- **Takip Edilen Satıcılar `followed-sellers.tsx`:** Kullanıcının ilgilendiği satıcıların listesi.
- **Yönetici Paneli `admin-dashboard.tsx`:** Sadece `isAdmin: true` olan kullanıcıların erişebildiği, ilanları onaylama ve şikayetleri değerlendirme sayfası.

---

## 2. Genel Mobil Frontend Prensipleri & UI/UX

### 1. Tasarım Sistemi & UI
- **Renk Paleti:** Marka rengi olarak Altın/Hardal (`#D4AF37`), Dark mod için Koyu Gri/Siyah (`#1a1a1a`), hata ve uyarılar için kırmızı (`#ef4444`) renkleri kullanılmıştır.
- **Typography & İkonlar:** Expo `@expo/vector-icons` üzerinden `Ionicons` ikon seti ile zenginleştirilmiş, kullanıcı dostu arayüz.
- **Spacing:** Minimum 16-20px padding yapıları kullanılarak temiz bir form/card görünümü sunulmuştur.

### 2. Kullanıcı Deneyimi (UX) Özellikleri
- **Pull-to-Refresh (Aşağı Çekerek Yenileme):** Uygulamadaki tüm liste ekranları (Vitrin, Mesajlar, İlanlarım vb.) `RefreshControl` bileşeni ile donatılmıştır. Kullanıcı ekranı kaydırarak güncel veriyi anında çekebilir.
- **Loading States:** Veri çekerken `ActivityIndicator` (spinner) ile kullanıcıya yüklenme durumları gösterilir.
- **Error Handling & Feedback:** Başarılı/Başarısız tüm işlemlerde (İlan eklendi, hata oluştu vb.) yerel `Alert` mekanizması ile geri bildirim verilir.
- **Real-Time Etkileşimler:** `useFocusEffect` (React Navigation) kullanılarak sayfalar her açıldığında verilerin otomatik güncellenmesi sağlanmıştır.

### 3. Navigasyon ve Routing
- **Expo Router:** Tüm sayfalar `app/` dizini altında dosya isimlerine göre (file-based routing) yönlendirilir. Klasik React Navigation yapısından çok daha modülerdir.
- **Bottom Tabs:** Uygulamanın alt tarafında sabit duran sekmeli navigasyon mevcuttur. Sekme geçişleri çok hızlı ve stabildir.
- **Hamburger Menu:** Modallar ve Sliderlar kullanılarak sağ üstten açılan dinamik menüler oluşturulmuştur (Giriş yapılmışsa Çıkış Yap, Yönetici ise Admin Paneli gibi dinamik linkler içerir).

### 4. Push Notifications (Telefon Bildirimleri)
- Uygulama, `expo-notifications` kütüphanesi entegrasyonuna sahiptir.
- Cihazdan otomatik izin isteyerek **Push Token** üretir.
- Gelen mesajlar veya kayıtlı aramalara düşen yeni ilanlar direkt donanımsal telefon bildirimi (titreşimli) olarak kullanıcıya ulaştırılır.
- *Not: Expo SDK 53 itibarıyla bildirim testi için Expo Go yerine Development Build (EAS) gereklidir.*