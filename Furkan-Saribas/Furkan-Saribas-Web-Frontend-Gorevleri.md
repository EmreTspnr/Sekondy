# Furkan Sarıbaş'ın Web Frontend Görevleri
**Web Front-end Demo Videosu:** [https://youtu.be/fWZNP3T2WjU]
Bu dokümanda Furkan Sarıbaş'ın sorumluluğunda olan sistem yapılandırmaları ve bileşenler detaylandırılmıştır. (Gereksinimler 1-6)

## 1. Kullanıcı Kayıt Olma Ekranı
- **Gereksinim:** `POST /auth/register` entegrasyonu ile üyelik sistemi
- **UI Bileşenleri:** Tailwind CSS ile tasarlanmış responsive kayıt formu (Ad, Soyad, Email, Şifre alanları). Form doğrulama mesajları.
- **Kullanıcı Deneyimi:** Şifre gücü göstergesi (zayıf, orta, güçlü). Form hata mesajlarının alanların altında anlık olarak gösterilmesi. Başarılı kayıt sonrası login sayfasına yönlendirme.
- **Teknik Detaylar:** React State (Controlled Components), Axios kullanımı, React Router v7 yönlendirmesi.

## 2. Sisteme Giriş Yapma Ekranı (Login)
- **Gereksinim:** `POST /auth/login` entegrasyonu
- **UI Bileşenleri:** Email ve Şifre inputları, "Şifremi Unuttum" linki, Giriş Butonu.
- **Kullanıcı Deneyimi:** Hatalı durumlarda "Geçersiz giriş bilgileri" uyarısı. Yükleme sırasında butonda spinner animasyonu (Framer Motion). Başarı halinde Ana Sayfaya yönlendirme.
- **Teknik Detaylar:** Context API üzerinden global Auth state kaydı. Token'ın localStorage içerisine güvenli kaydedilmesi.

## 3. Profil Bilgilerini Güncelleme Formu
- **Gereksinim:** `PUT /profile` entegrasyonu
- **UI Bileşenleri:** Kullanıcı bilgilerinin veritabanından önceden yüklendiği editable (düzenlenebilir) form.
- **Kullanıcı Deneyimi:** Kaydedilmemiş değişiklikler varken "Kaydet" butonunun aktif renk alması. Başarılı işlem sonrası "Profil başarıyla güncellendi" bildirimi (Toast).
- **Teknik Detaylar:** Form dirty form state takibi, hata durumunda catch() bloğunda spesifik UI bildirimleri.

## 4. Kullanıcı Profilini Görüntüleme Arayüzü
- **Gereksinim:** `GET /profile` entegrasyonu
- **UI Bileşenleri:** Kullanıcı profil resmi (Avatar), hesap istatistikleri ve bilgileri modülü.
- **Kullanıcı Deneyimi:** Veri çekilirken Skeleton Loading ve yumuşak geçiş efektleri gösterilmesi.
- **Teknik Detaylar:** `useEffect` hook'u ile veri çekimi, asenkron verilerin ekrana yansıtılması.

## 5. Kullanıcı Hesabını Silme Akışı
- **Gereksinim:** `DELETE /profile` entegrasyonu
- **UI Bileşenleri:** Hesabı sil butonuna tıklandığında açılan yüksek öncelikli uyarı Modal'ı (Tailwind Dialog).
- **Kullanıcı Deneyimi:** Yanlış tıklamalara karşı tehlikeli eylem onayı (örn. "Sil" kelimesini input içine yazmasını isteme). Sildikten sonra çıkış (logout).
- **Teknik Detaylar:** Dialog component render sistemi; çıkış sonrası Auth Context'in `null` çekilip yönlendirilmesi.

## 6. Giriş Geçmişini Listeleme
- **Gereksinim:** `GET /auth/history` entegrasyonu
- **UI Bileşenleri:** Tarih sıralı logların bulunduğu cihaz geçmişi listesi/tablo yapısı.
- **Kullanıcı Deneyimi:** Cihazların tiplerine göre mobil/masaüstü (Lucide React) cihaz simgeleriyle farklılaştırılmış listeleme.
- **Teknik Detaylar:** Verilerin `map` fonksiyonuyla listelenmesi; mobil görünümde kart yapısına dönüşen grid sistemi.