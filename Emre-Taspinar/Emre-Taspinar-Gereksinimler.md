# İlan Oluşturma ve Yönetimi API Dokümantasyonu

1. **Yeni İlan Ekleme**
   - **API Metodu:** `POST /listings`
   - **Açıklama:** Kullanıcının daire gibi satmak veya kiralamak istediği bir mülk için sistemde yeni bir ilan kaydı oluşturmasını sağlar. İlanın temel başlık, fiyat ve detay bilgileri bu aşamada sisteme iletilir. Güvenlik için giriş yapmış olmak gerekir.

2. **İlana Fotoğraf Yükleme**
   - **API Metodu:** `POST /listings/{listingId}/photos`
   - **Açıklama:** Kullanıcının daha önceden oluşturduğu ilanın detaylarına cihazından görsel dosyaları eklemesini sağlar. Yalnızca ilanın sahibi tarafından gerçekleştirilebilir.

3. **İlan Bilgilerini Güncelleme**
   - **API Metodu:** `PUT /listings/{listingId}`
   - **Açıklama:** İlan sahibinin, yayında olan bir ilanının fiyat, açıklama veya başlık gibi detaylarını sonradan değiştirmesine olanak tanır. Kullanıcılar yalnızca kendi ilanları üzerinde güncelleme yapabilir.

4. **İlan Detaylarını Görüntüleme**
   - **API Metodu:** `GET /listings/{listingId}`
   - **Açıklama:** Platformdaki herhangi bir ilana tıklandığında, ilana ait tüm açıklamaların, özelliklerin ve resimlerin listelenmesini sağlar. Bu işlem genellikle herkesin erişimine açıktır.

5. **İlanı Silme**
   - **API Metodu:** `DELETE /listings/{listingId}`
   - **Açıklama:** Satışı gerçekleşen bir ürünün veya yayından kaldırılmak istenen bir ilanın sistemden tamamen silinmesini sağlar. Bu işlem geri alınamaz. Sadece ilan sahibi veya sistem yöneticileri tarafından yapılabilir.

6. **Kendi İlanlarını Listeleme**
   - **API Metodu:** `GET /users/{userId}/listings`
   - **Açıklama:** İlan sahibinin sisteme yüklediği tüm aktif veya pasif ilanlarını toplu olarak, bir liste halinde görüntülemesini sağlar. Kişinin kendi panosunda ilanlarını yönetebilmesi için kullanılır.
