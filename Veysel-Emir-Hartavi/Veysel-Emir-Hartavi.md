### 5. Kişi (Yönetim Paneli ve Sistem Denetimi)

1. **İlan Şikayet Etme**
    - **API Metodu:** `POST /listings/{listingId}/reports`
    - **Açıklama:** Bir kullanıcının, yanıltıcı olduğunu düşündüğü bir ilanı incelenmesi için yönetime bildirmesi.

2. **İlan Durumunu Onaylama**
    - **API Metodu:** `PUT /admin/listings/{listingId}/approve`
    - **Açıklama:** Sistem yöneticisinin, incelenen ilanları kurallara uygun bulduğunda yayına alması.

3. **Kullanıcı Hesabını Askıya Alma**
    - **API Metodu:** `PUT /admin/users/{userId}/suspend`
    - **Açıklama:** Yöneticinin, platformu kötüye kullanan bir üyenin hesabını geçici olarak durdurması.

4. **Uygunsuz İlanı Silme**
    - **API Metodu:** `DELETE /admin/listings/{listingId}`
    - **Açıklama:** Sistem yöneticisinin, kuralları ihlal eden bir ilanı sistemden tamamen kaldırması.

5. **Onay Bekleyen İlanları Listeleme**
    - **API Metodu:** `GET /admin/listings/pending`
    - **Açıklama:** Sistem yöneticisinin, yeni açılan ve henüz yayına girmemiş ilanları bir ekranda görmesi.

6. **Şikayet Edilen İlanları Listeleme**
    - **API Metodu:** `GET /admin/listings/reported`
    - **Açıklama:** Yöneticinin, diğer kullanıcılar tarafından sorunlu olarak işaretlenen ilanları liste halinde görmesi.