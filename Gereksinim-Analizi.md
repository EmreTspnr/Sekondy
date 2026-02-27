# Tüm Gereksinimler

1. **Kullanıcı Kayıt Olma** (Furkan Sarıbaş)
    - **API Metodu:** `POST /auth/register`
    - **Açıklama:** Kullanıcıların ad, soyad ve iletişim bilgileriyle sisteme yeni bir hesap açması.

2. **Sisteme Giriş Yapma** (Furkan Sarıbaş)
    - **API Metodu:** `POST /auth/login`
    - **Açıklama:** Kayıtlı kullanıcıların e-posta ve şifrelerini kullanarak hesaplarına erişmesi.

3. **Profil Bilgilerini Güncelleme** (Furkan Sarıbaş)
    - **API Metodu:** `PUT /profile`
    - **Açıklama:** Kullanıcıların telefon numarası veya adres gibi kişisel detaylarını değiştirmesi.

4. **Kullanıcı Profilini Görüntüleme** (Furkan Sarıbaş)
    - **API Metodu:** `GET /profile`
    - **Açıklama:** Kullanıcının kendi hesap bilgilerini ekranda görmesi.

5. **Kullanıcı Hesabını Silme** (Furkan Sarıbaş)
    - **API Metodu:** `DELETE /profile`
    - **Açıklama:** Sistemi kullanmak istemeyen bir kişinin hesabını tamamen kaldırması.

6. **Giriş Geçmişini Listeleme** (Furkan Sarıbaş)
    - **API Metodu:** `GET /auth/history`
    - **Açıklama:** Kullanıcının hesabına daha önce hangi cihazlardan girdiğini liste halinde görmesi.

7. **Yeni İlan Ekleme** (Emre Taşpınar)
    - **API Metodu:** `POST /ads`
    - **Açıklama:** Kullanıcının daire gibi satmak veya kiralamak istediği bir mülk için kayıt oluşturması.

8. **İlana Fotoğraf Yükleme** (Emre Taşpınar)
    - **API Metodu:** `POST /ads/:adId/photos`
    - **Açıklama:** Kullanıcının oluşturduğu ilanın detaylarına cihazından görsel eklemesi.

9. **İlan Bilgilerini Güncelleme** (Emre Taşpınar)
    - **API Metodu:** `PUT /ads/:adId`
    - **Açıklama:** İlan sahibinin, yayında olan bir ilanının fiyatını veya açıklamasını sonradan değiştirmesi.

10. **İlan Detaylarını Görüntüleme** (Emre Taşpınar)
    - **API Metodu:** `GET /ads/:adId`
    - **Açıklama:** Platformdaki herhangi bir ilana tıklandığında tüm açıklamaların ve resimlerin okunması.

11. **İlanı Silme** (Emre Taşpınar)
    - **API Metodu:** `DELETE /ads/:adId`
    - **Açıklama:** Satışı gerçekleşen bir ürünün ilanının sistemden tamamen kaldırılması.

12. **Kendi İlanlarını Listeleme** (Emre Taşpınar)
    - **API Metodu:** `GET /my-ads`
    - **Açıklama:** İlan sahibinin sisteme yüklediği tüm aktif ilanlarını toplu olarak görmesi.

13. **Satıcıyı Takip Etme** (Sinan Ece)
    - **API Metodu:** `POST /users/:userId/follow`
    - **Açıklama:** Kullanıcının, beğendiği veya güvenilir bulduğu bir satıcının yeni ilanlarından haberdar olmak için hesabını takibe alması.

14. **Arama Kriterlerini Kaydetme** (Sinan Ece)
    - **API Metodu:** `POST /saved-searches`
    - **Açıklama:** Kullanıcının sık yaptığı bir aramayı daha sonra tekrar kullanmak üzere sisteme kaydetmesi.

15. **Arama Bildirimlerini Açma** (Sinan Ece)
    - **API Metodu:** `PUT /saved-searches/:searchId/notifications`
    - **Açıklama:** Kullanıcının, kaydettiği arama kriterlerine uygun yeni bir ilan eklendiğinde haber verilmesi tercihini açması.

16. **Kayıtlı Aramayı Silme** (Sinan Ece)
    - **API Metodu:** `DELETE /saved-searches/:searchId`
    - **Açıklama:** Kullanıcının daha önceden kaydettiği bir arama filtresini kendi listesinden çıkartması.

17. **Kategoriye Göre İlan Listeleme** (Sinan Ece)
    - **API Metodu:** `GET /ads/category/:categoryId`
    - **Açıklama:** Ziyaretçilerin emlak veya vasıta gibi belirli bir gruba ait ilanları süzerek görmesi.

18. **Vitrin İlanlarını Görüntüleme** (Sinan Ece)
    - **API Metodu:** `GET /ads/showcase`
    - **Açıklama:** Platformun ana sayfasına giren kullanıcıların, öne çıkarılan ilanları liste halinde görmesi.

19. **Satıcıya Mesaj Gönderme** (Ramize Elif Ermiş)
    - **API Metodu:** `POST /messages`
    - **Açıklama:** Bir ilanla ilgilenen alıcının, sistem üzerinden satıcıya doğrudan soru sorması.

20. **İlanı Favorilere Ekleme** (Ramize Elif Ermiş)
    - **API Metodu:** `POST /favorites`
    - **Açıklama:** Kullanıcının dikkatini çeken bir ilanı, daha sonra kolayca bulabilmek için kendi özel listesine kaydetmesi.

21. **Mesajı Okundu İşaretleme** (Ramize Elif Ermiş)
    - **API Metodu:** `PUT /messages/:messageId/read`
    - **Açıklama:** Kullanıcının açıp okuduğu bir mesajın durumunu sistem üzerinde okundu olarak değiştirmesi.

22. **Gelen Mesajı Silme** (Ramize Elif Ermiş)
    - **API Metodu:** `DELETE /messages/:messageId`
    - **Açıklama:** Kullanıcının kendi gelen kutusunda bulunan ve artık ihtiyaç duymadığı bir mesajı silmesi.

23. **Gelen Mesajları Listeleme** (Ramize Elif Ermiş)
    - **API Metodu:** `GET /messages`
    - **Açıklama:** Kullanıcının kendisine diğer üyelerden gelen tüm mesajları bir kutu içerisinde görmesi.

24. **Favori İlanları Listeleme** (Ramize Elif Ermiş)
    - **API Metodu:** `GET /favorites`
    - **Açıklama:** Kullanıcının daha önceden beğenip listesine eklediği tüm ilanları bir sayfada görmesi.

25. **İlan Şikayet Etme** (Veysel Emir Hartavi)
    - **API Metodu:** `POST /reports`
    - **Açıklama:** Bir kullanıcının, yanıltıcı olduğunu düşündüğü bir ilanı incelenmesi için yönetime bildirmesi.

26. **İlan Durumunu Onaylama** (Veysel Emir Hartavi)
    - **API Metodu:** `PUT /admin/ads/:adId/approve`
    - **Açıklama:** Sistem yöneticisinin, incelenen ilanları kurallara uygun bulduğunda yayına alması.

27. **Kullanıcı Hesabını Askıya Alma** (Veysel Emir Hartavi)
    - **API Metodu:** `PUT /admin/users/:userId/suspend`
    - **Açıklama:** Yöneticinin, platformu kötüye kullanan bir üyenin hesabını geçici olarak durdurması.

28. **Uygunsuz İlanı Silme** (Veysel Emir Hartavi)
    - **API Metodu:** `DELETE /admin/ads/:adId`
    - **Açıklama:** Sistem yöneticisinin, kuralları ihlal eden bir ilanı sistemden tamamen kaldırması.

29. **Onay Bekleyen İlanları Listeleme** (Veysel Emir Hartavi)
    - **API Metodu:** `GET /admin/ads/pending`
    - **Açıklama:** Sistem yöneticisinin, yeni açılan ve henüz yayına girmemiş ilanları bir ekranda görmesi.

30. **Şikayet Edilen İlanları Listeleme** (Veysel Emir Hartavi)
    - **API Metodu:** `GET /admin/reports`
    - **Açıklama:** Yöneticinin, diğer kullanıcılar tarafından sorunlu olarak işaretlenen ilanları liste halinde görmesi.

# Gereksinim Dağılımları

1. [Furkan Sarıbaş'ın Gereksinimleri](Furkan-Saribas/Furkan-Saribas-Gereksinimler.md)
2. [Emre Taşpınar'ın Gereksinimleri](Emre-Taspinar/Emre-Taspinar-Gereksinimler.md)
3. [Sinan Ece'nin Gereksinimleri](Sinan-Ece/Sinan-Ece-Gereksinimler.md)
4. [Ramize Elif Ermiş'in Gereksinimleri](Ramize-Elif-Ermis/Ramize-Elif-Ermis-Gereksinimler.md)
5. [Veysel Emir Hartavi'nin Gereksinimleri](Veysel-Emir-Hartavi/Veysel-Emir-Hartavi-Gereksinimler.md)