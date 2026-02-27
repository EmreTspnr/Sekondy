# Etkileşim, Mesajlaşma ve Favoriler

1. **Satıcıya Mesaj Gönderme**
   - **API Metodu:** `POST /messages`
   - **Açıklama:** Bir ilanla ilgilenen alıcının, sistem üzerinden satıcıya doğrudan soru sorması.

2. **İlanı Favorilere Ekleme**
   - **API Metodu:** `POST /favorites`
   - **Açıklama:** Kullanıcının dikkatini çeken bir ilanı, daha sonra kolayca bulabilmek için kendi özel listesine kaydetmesi.

3. **Mesajı Okundu İşaretleme**
   - **API Metodu:** `PUT /messages/{messageId}/read`
   - **Açıklama:** Kullanıcının açıp okuduğu bir mesajın durumunu sistem üzerinde okundu olarak değiştirmesi.

4. **Gelen Mesajı Silme**
   - **API Metodu:** `DELETE /messages/{messageId}`
   - **Açıklama:** Kullanıcının kendi gelen kutusunda bulunan ve artık ihtiyaç duymadığı bir mesajı silmesi.

5. **Gelen Mesajları Listeleme**
   - **API Metodu:** `GET /messages`
   - **Açıklama:** Kullanıcının kendisine diğer üyelerden gelen tüm mesajları bir kutu içerisinde görmesi.

6. **Favori İlanları Listeleme**
   - **API Metodu:** `GET /favorites`
   - **Açıklama:** Kullanıcının daha önceden beğenip listesine eklediği tüm ilanları bir sayfada görmesi.
