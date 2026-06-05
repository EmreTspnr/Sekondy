# Ramize Elif Ermiş'in Mobil Frontend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek]

## 1. Canlı Sohbet (Chat) Ekranı 
- **Dosya:** `mobile/app/chat/[id].tsx`
- **Görev:** Giden mesajı sağa (farklı renk), geleni sola yaslayan WhatsApp tarzı dinamik UI kurgusunun geliştirilmesi.

## 2. Klavye Uyumluluğu ve Oto-Aşağı Kaydırma
- **Dosya:** `mobile/app/chat/[id].tsx`
- **Görev:** Sohbet içinde klavye açıldığında ekranın kapanmaması için `KeyboardAvoidingView` entegrasyonu ve yeni mesajda otomatik aşağı inme (ScrollToBottom).

## 3. Gelen Kutusu (Messages Tab) Ekranı
- **Dosya:** `mobile/app/(tabs)/messages.tsx`
- **Görev:** Kişilerin profil ikonları ve son mesajın ön izlemesinin yer aldığı sıralı mesaj menüsü tasarımı.

## 4. İlandan Satıcıya Doğrudan Mesaj Bağlantısı
- **Görev:** İlan sayfasından "Satıcıya Mesaj Gönder" butonuna basıldığında expo-router (`router.push`) ile ilgili satıcının ID parametresiyle chat ekranının açılması.

## 5. Favorilerim Ekranı 
- **Dosya:** `mobile/app/(tabs)/favorites.tsx`
- **Görev:** Kullanıcının takip ettiği ilanların kart tasarımları ve listeden çıkarma özelliklerinin kodlanması.

## 6. Favori Kalp İkonu (Optimistic UI)
- **Görev:** Vitrindeki ilan kartlarında bulunan kalp ikonuna basıldığında API cevabı (gecikme) beklenmeden ikonu anında dolu kalbe çeviren performanslı UI algoritması.