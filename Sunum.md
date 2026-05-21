# Video Sunum

## Sunum Videosu

> **Video Linki:** [Sunum videosu linki buraya eklenecek](https://example.com)

---

## Sunum Yapısı

### 1. Grup Lideri - Açılış Konuşması (1-2 dakika)

**Konuşma İçeriği:**
- Grup adının tanıtılması
- Projenin genel tanıtımı
- Projenin amacı ve kapsamı
- Sunumun yapısının kısaca açıklanması

**Örnek Konuşma:**
> "Merhaba, ben Veysel Emir Hartavi. Sekondy ekibi olarak geliştirdiğimiz ikinci el alım-satım projemizi bugün sizlere sunacağız. Projemiz React Native ile geliştirilmiş mobil uygulama ve Node.js tabanlı REST API'den oluşmaktadır. Bugün projemizin temel işlevlerini ve ekibimizin geliştirdiği servisleri göstereceğiz. Her ekip üyesi kendini tanıtacak ve sorumlu olduğu API ve arayüz entegrasyonlarını canlı olarak test edecektir."

---

### 2. Ekip Üyeleri - Kişisel Tanıtım ve Gereksinim Sunumu

Her ekip üyesi için aşağıdaki yapı takip edilecektir:

#### Format (Her üye için 4-6 dakika)

**A) Kişisel Tanıtım (30-45 saniye)**
- Yüz görünecek şekilde kamera karşısında
- İsim ve soyisim
- Ekipteki rolü
- Sorumlu olduğu alan (Backend/Frontend/Mobil vb.)

**B) Gereksinim Sunumu (3.5-5 dakika)**
- Sorumlu olduğu gereksinimlerin listesi
- Her gereksinimin kısa açıklaması
- Canlı demo (ekran kaydı ile)
- Her gereksinimin çalışır durumda olduğunun detaylı gösterilmesi
- Her gereksinim için yeterli süre ayrılmalı (yaklaşık 1-1.5 dakika/gereksinim)

---

### 4. Ekip Üyeleri Sunum Sırası

#### 1. Furkan Sarıbaş
**Kişisel Tanıtım:**
- İsim: Furkan Sarıbaş
- Sorumlu Olduğu Alan: Kimlik Doğrulama ve Profil Yönetimi (Auth & Profile)

**Gereksinimler (API & Mobil Entegrasyon):**
1. **Üye Olma**
   - API Metodu: `POST /auth/register`
   - Demo: Kullanıcı kayıt formunun doldurulup backend'e gönderilmesi
2. **Giriş Yapma**
   - API Metodu: `POST /auth/login`
   - Demo: Başarılı giriş ve JWT Token'ın (AsyncStorage) cihaza kaydedilmesi
3. **Cihaz Bildirim Kaydı**
   - API Metodu: `POST /auth/push-token`
   - Demo: Expo Push Token oluşturulup veritabanına işlenmesi

---

#### 2. Emre Taşpınar
**Kişisel Tanıtım:**
- İsim: Emre Taşpınar
- Sorumlu Olduğu Alan: İlan Yönetimi ve Vitrin (Ad Management)

**Gereksinimler (API & Mobil Entegrasyon):**
1. **İlan Ekleme ve Fotoğraf Yükleme**
   - API Metodu: `POST /ads` ve `POST /ads/:id/photos`
   - Demo: Yeni bir ilanın formData ile fotoğraflarıyla birlikte yüklenmesi
2. **Vitrin Listeleme (Tüm İlanlar)**
   - API Metodu: `GET /ads`
   - Demo: Onaylanmış tüm ilanların kategorilere göre çekilip anasayfada gösterilmesi
3. **İlan Detayı**
   - API Metodu: `GET /ads/:id`
   - Demo: Bir ilanın detay sayfasına girilip tüm bilgilerin ve resimlerin getirilmesi

---

#### 3. Veysel Emir Hartavi (Grup Lideri)
**Kişisel Tanıtım:**
- İsim: Veysel Emir Hartavi
- Sorumlu Olduğu Alan: Etkileşimler (Favoriler ve Kayıtlı Aramalar)

**Gereksinimler (API & Mobil Entegrasyon):**
1. **Favorilere Ekleme ve Çıkarma**
   - API Metodu: `POST /favorites` ve `DELETE /favorites`
   - Demo: Bir ilanın favorilere eklenmesi ve favorilerim ekranında (`GET /favorites`) listelenmesi
2. **Aramayı Kaydetme**
   - API Metodu: `POST /saved-searches`
   - Demo: Bir anahtar kelimenin aranıp kaydedilmesi ve listelenmesi
3. **Kayıtlı Arama Bildirimleri**
   - Push Notification Testi: Kayıtlı aramaya uyan ilan girildiğinde bildirimin (Push Notification) gelmesi

---

#### 4. Sinan Ece
**Kişisel Tanıtım:**
- İsim: Sinan Ece
- Sorumlu Olduğu Alan: Gerçek Zamanlı Mesajlaşma (Messaging)

**Gereksinimler (API & Mobil Entegrasyon):**
1. **Sohbet Başlatma ve Mesaj Gönderme**
   - API Metodu: `POST /messages`
   - Demo: Bir ilan sahibiyle sohbet başlatılması ve mesaj iletilmesi
2. **Gelen Kutusu (Sohbetleri Listeleme)**
   - API Metodu: `GET /messages`
   - Demo: Kullanıcının daha önce mesajlaştığı kişilerin listelenmesi
3. **Mesaj Geçmişi**
   - API Metodu: `GET /messages/partner/:id`
   - Demo: Belirli bir sohbete girilip önceki mesajların balonlar halinde gösterilmesi

---

#### 5. Ramize Elif Ermiş
**Kişisel Tanıtım:**
- İsim: Ramize Elif Ermiş
- Sorumlu Olduğu Alan: Yönetim ve Şikayet Paneli (Admin & Reports)

**Gereksinimler (API & Mobil Entegrasyon):**
1. **İlan Şikayet Etme**
   - API Metodu: `POST /listings/:id/reports`
   - Demo: Mobil uygulamadan bir ilanın şikayet edilmesi
2. **Admin: İlan Onaylama / Reddetme**
   - API Metodu: `PUT /admin/ads/:id/approve`
   - Demo: Bekleyen (pending) bir ilanın admin paneli üzerinden onaylanması
3. **Admin: Şikayetleri Görüntüleme**
   - API Metodu: `GET /admin/reports`
   - Demo: Şikayet edilen ilanların admin tarafından incelenmesi

### 4. Grup Lideri - Kapanış Konuşması (1 dakika)

**Konuşma İçeriği:**
- Tüm gereksinimlerin tamamlandığının özeti
- Projenin başarıyla tamamlandığının vurgulanması

**Örnek Konuşma:**
> "Bugün sizlere Sekondy projemizi sunduk. Tüm ekip üyelerimiz sorumlu oldukları REST API servislerini ve bunların mobil uygulamadaki arayüz entegrasyonlarını başarıyla tamamladılar. Projemiz baştan uca çalışan, push bildirimleri ve yetkilendirmesi olan güvenli bir 2. el ticaret platformu haline gelmiştir. Dinlediğiniz için teşekkürler!"

---

## Sunum Hazırlık Kontrol Listesi

### Genel Hazırlık
- [ ] Grup lideri açılış konuşmasını hazırladı
- [ ] Her ekip üyesi kendi sunumunu hazırladı
- [ ] Tüm gereksinimler çalışır durumda
- [ ] Demo senaryoları hazırlandı
- [ ] Test verileri ve hesaplar hazırlandı

### Teknik Hazırlık
- [ ] Video kayıt cihazı/kamera hazır
- [ ] Mikrofon kalitesi test edildi
- [ ] Işıklandırma uygun
- [ ] Arka plan düzenlendi
- [ ] Ekran kayıt yazılımı hazır (demo için)

### Kişisel Hazırlık
- [ ] Her ekip üyesi kendi bölümünü prova etti
- [ ] Konuşma süreleri kontrol edildi
- [ ] Gereksinimler ezberlendi veya notlar hazırlandı
- [ ] Demo akışı prova edildi

---

## Video Çekim Teknikleri

### Kişisel Tanıtım Bölümü
- **Kamera Açısı:** Yüz net görünecek şekilde
- **Işık:** Yüzün iyi aydınlatıldığından emin olun
- **Arka Plan:** Temiz ve profesyonel görünüm
- **Görüntü:** Omuz üstü çekim
- **Göz Teması:** Kameraya bakarak konuşun

### Demo Bölümü
- **Ekran Kaydı:** Net ve yüksek çözünürlükte
- **Ses:** Demo sırasında açıklama yapın
- **Hız:** Yavaş ve anlaşılır hareket edin
- **Vurgu:** Önemli noktaları işaret edin

---

## Zaman Yönetimi

- **Grup Lideri Açılış:** 1-2 dakika
- **Her Ekip Üyesi:** 4-6 dakika
  - Kişisel tanıtım: 30-45 saniye
  - Gereksinim sunumu: 3.5-5 dakika
    - Her gereksinim için: yaklaşık 1-1.5 dakika
- **Grup Lideri Kapanış:** 1-2 dakika
- **Toplam Süre:** Yaklaşık 30-40 dakika (5 kişilik ekip için)