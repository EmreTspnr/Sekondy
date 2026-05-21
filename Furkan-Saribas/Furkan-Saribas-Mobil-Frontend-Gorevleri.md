# Furkan Sarıbaş'ın Mobil Frontend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek]

## 1. Kayıt Ol (Register) Ekranı
- **Dosya:** `mobile/app/register.tsx`
- **Görev:** Geçerli e-posta formatı kontrolü ve form boş bırakıldığında çıkan hata mesajlarının yönetimi.

## 2. Sisteme Giriş (Login) Ekranı
- **Dosya:** `mobile/app/login.tsx`
- **Görev:** Başarılı girişte backend'den dönen Token'ın cihazın güvenli hafızasına (`AsyncStorage`) kaydedilmesi.

## 3. Profil Bilgileri Ekranı
- **Dosya:** `mobile/app/(tabs)/profile.tsx`
- **Görev:** Oturum açmış kullanıcının bilgilerinin çekilip tasarımsal olarak gösterilmesi. Çıkış yap butonunun entegrasyonu.

## 4. Global Oturum ve Token Yönetimi (Interceptor)
- **Dosya:** `mobile/services/api.ts`
- **Görev:** Axios Request Interceptor ile tüm uygulama API isteklerine otomatik olarak Token ekleme mekanizmasının kurulması.

## 5. Otomatik Çıkış (401 Unauthorized) Kontrolü
- **Dosya:** `mobile/services/api.ts`
- **Görev:** Axios Response Interceptor ile token süresi dolduğunda uygulamayı yakalayıp güvenli şekilde Login ekranına atma.

## 6. Hesap Silme Arayüzü
- **Görev:** Profil ekranındaki "Hesabı Sil" butonuyla kullanıcının onayını (`Alert.confirm`) aldıktan sonra çıkış işlemlerinin tamamlanması.
