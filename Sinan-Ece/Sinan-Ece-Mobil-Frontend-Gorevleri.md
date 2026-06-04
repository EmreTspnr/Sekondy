# Sinan Ece'nin Mobil Frontend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek]

## 1. Vitrin Anasayfa Ekranı
- **Dosya:** `mobile/app/(tabs)/index.tsx`
- **Görev:** API'den gelen vitrin ilanlarının iki kolonlu ızgara (Grid) biçiminde modern gösterimi. Fiyatların TL formatına uyarlanması.

## 2. Kategori Hapları (Pill Filters) Entegrasyonu
- **Dosya:** `mobile/app/(tabs)/index.tsx`
- **Görev:** Yatay scroll ile kaydırılabilir kategori butonları. Kategori seçildiğinde arayüzün anında `/ads?category=X` endpointine istek atarak filtrelenmesi.

## 3. Kayıtlı Aramalar Ekranı
- **Dosya:** `mobile/app/saved-searches.tsx`
- **Görev:** Kullanıcının kaydettiği kelimelerin temiz bir listesi. Aşağı çekerek yenileme (`RefreshControl`) işlevinin eklenmesi.

## 4. Bildirim Şalteri (Switch) Bağlantısı
- **Dosya:** `mobile/app/saved-searches.tsx`
- **Görev:** React Native `Switch` componenti kullanılarak arama bildirimlerinin anlık `true/false` olarak API'ye yollanması.

## 5. Takip Edilen Satıcılar Ekranı
- **Dosya:** `mobile/app/followed-sellers.tsx`
- **Görev:** Takibe alınan kişilerin profillerinin listelendiği ayrı bir ekran.

## 6. Arama Barı Tasarımı
- **Görev:** Vitrin en üstünde konumlanan, kullanıcıdan anahtar kelime alıp ilanları başlığa göre süzen SearchBar arayüzü.