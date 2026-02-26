# Kullanıcı ve Hesap Yönetimi API Dokümantasyonu

1. **Kullanıcı Kayıt Olma**
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Kullanıcıların ad, soyad ve iletişim bilgileriyle sisteme yeni bir hesap açmasıdır.

2. **Sisteme Giriş Yapma**
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Kayıtlı kullanıcıların e-posta ve şifrelerini kullanarak hesaplarına güvenli bir şekilde erişmesini sağlar.

3. **Profil Bilgilerini Güncelleme**
   - **API Metodu:** `PUT /users/{userId}`
   - **Açıklama:** Kullanıcıların telefon numarası veya adres gibi kişisel detaylarını sonradan değiştirmesine olanak tanır.

4. **Kullanıcı Profilini Görüntüleme**
   - **API Metodu:** `GET /users/{userId}`
   - **Açıklama:** Kullanıcının kendi hesap bilgilerini ve kayıtlı detaylarını ekranda görüntülemesi için kullanılır.

5. **Kullanıcı Hesabını Silme**
   - **API Metodu:** `DELETE /users/{userId}`
   - **Açıklama:** Sistemi kullanmak istemeyen bir kişinin hesabını ve verilerini sistemden tamamen kaldırmasını sağlar.

6. **Giriş Geçmişini Listeleme**
   - **API Metodu:** `GET /users/{userId}/login-history`
   - **Açıklama:** Kullanıcının hesabına daha önce hangi cihazlardan ve ne zaman girdiğini liste halinde görmesini sağlar.