# Ramize Elif Ermiş'in Mobil Backend Görevleri
**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** [Link buraya eklenecek]

## 1. Satıcıya Mesaj Gönderme
- **API Endpoint:** `POST /messages`
- **Görev:** Gönderici, alıcı, içerik ve bağlı olduğu ilanın Mongoose ile `Message` modeline kaydedilmesi. Anlık mesaj bildirimi tetiklenmesi.

## 2. İlanı Favorilere Ekleme
- **API Endpoint:** `POST /favorites`
- **Görev:** Mongoose `$addToSet` fonksiyonuyla ilanın favoriler listesine çoğaltılmadan eklenmesi.

## 3. Mesajı Okundu İşaretleme
- **API Endpoint:** `PUT /messages/:messageId/read`
- **Görev:** Sohbet ekranı açıldığında okunmamış (isRead: false) mesajların statüsünün okunmuş olarak güncellenmesi.

## 4. Gelen Mesajı Silme
- **API Endpoint:** `DELETE /messages/:messageId`
- **Görev:** Kullanıcının kendi posta kutusundan gereksiz bir mesajı fiziksel/mantıksal olarak silmesi.

## 5. Gelen Mesajları Listeleme (Sohbet Kutusu)
- **API Endpoint:** `GET /messages` ve `GET /messages/partner/:id`
- **Görev:** 1) Sohbet edilen kişilerin benzersiz (grouped) listelenmesi. 2) Bir sohbetteki geçmiş mesajların kronolojik (`createdAt: 1`) sıralanması.

## 6. Favori İlanları Listeleme
- **API Endpoint:** `GET /favorites`
- **Görev:** Kullanıcının önceden kaydettiği ilanların tüm nesneleriyle (Populate) birlikte ekrana dönülmesi.