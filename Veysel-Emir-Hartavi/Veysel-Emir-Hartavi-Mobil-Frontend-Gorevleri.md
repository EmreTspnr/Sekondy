# Veysel Emir Hartavi'nin Mobil Frontend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek]

## 1. İlan Şikayet Formu Arayüzü
- **Dosya:** `mobile/app/report-ad.tsx`
- **Görev:** İlan sayfasından "Şikayet Et"e basıldığında açılan TextArea içeren özel şikayet formu ekranı.

## 2. Yönetim (Admin) Paneli Dashboard'u
- **Dosya:** `mobile/app/(tabs)/admin.tsx`
- **Görev:** Yöneticilerin istatistikleri ve bekleyen işleri görebileceği ana gösterge paneli tasarımı.

## 3. Bekleyen İlanlar Tablosu ve Onay/Red Butonları
- **Görev:** Yönetim panelinde FlatList ile bekleyen ilanları listelemek. Onay butonlarına basıldığında API isteği atıp listenin canlı (Re-fetch) olarak yenilenmesi.

## 4. Rol Tabanlı (Role-Based) Arayüz Gizleme
- **Dosya:** `mobile/app/(tabs)/_layout.tsx`
- **Görev:** Yalnızca `isAdmin: true` olan oturumlarda "Yönetici" isimli sekmenin aktif olması, standart kullanıcılardan tamamen gizlenmesi.

## 5. Şikayet Raporları İnceleme Listesi
- **Görev:** Şikayet edilmiş ilanların neden şikayet edildiğini gösteren liste ekranının tasarımı.

## 6. Expo Push Notification Token Yönetimi
- **Görev:** İlan durumu onaylandığında (Approve) arama kaydedenlere gidecek bildirimin çalışması için mobil tarafta Push Token izinlerinin Expo Go/SDK kısıtlarına rağmen çözümlenmesi (`usePushNotifications.ts`).