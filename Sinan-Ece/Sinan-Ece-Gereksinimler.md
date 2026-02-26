# 3. Arama, Filtreleme ve Takip Özellikleri

1. **Satıcıyı Takip Etme**
   - **API Metodu:** `POST /users/{sellerId}/follow`
   - **Açıklama:** Kullanıcının, beğendiği veya güvenilir bulduğu bir satıcının yeni ilanlarından haberdar olmak için hesabını takibe alması.

2. **Arama Kriterlerini Kaydetme**
   - **API Metodu:** `POST /saved-searches`
   - **Açıklama:** Kullanıcının sık yaptığı bir aramayı daha sonra tekrar kullanmak üzere sisteme kaydetmesi.

3. **Arama Bildirimlerini Açma**
   - **API Metodu:** `PUT /saved-searches/{searchId}/notifications`
   - **Açıklama:** Kullanıcının, kaydettiği arama kriterlerine uygun yeni bir ilan eklendiğinde haber verilmesi tercihini açması.

4. **Kayıtlı Aramayı Silme**
   - **API Metodu:** `DELETE /saved-searches/{searchId}`
   - **Açıklama:** Kullanıcının daha önceden kaydettiği bir arama filtresini kendi listesinden çıkartması.

5. **Kategoriye Göre İlan Listeleme**
   - **API Metodu:** `GET /categories/{categoryId}/listings`
   - **Açıklama:** Ziyaretçilerin emlak veya vasıta gibi belirli bir gruba ait ilanları süzerek görmesi.

6. **Vitrin İlanlarını Görüntüleme**
   - **API Metodu:** `GET /listings/showcase`
   - **Açıklama:** Platformun ana sayfasına giren kullanıcıların, öne çıkarılan ilanları liste halinde görmesi.