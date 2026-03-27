const mongoose = require('mongoose');
const Message = mongoose.model('Message');
const User = mongoose.model('User');

// 1. Satıcıya Mesaj Gönderme
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, listingId, content } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ mesaj: "Kendinize mesaj gönderemezsiniz." });
    }

    if (!content) {
      return res.status(400).json({ mesaj: "Mesaj içeriği boş olamaz." });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      listing: listingId,
      content
    });

    res.status(201).json({ mesaj: "Mesaj başarıyla gönderildi.", message: newMessage });
  } catch (error) {
    res.status(500).json({ mesaj: "Mesaj gönderilirken hata oluştu.", hata: error.message });
  }
};

// 2. Gelen Mesajları Listeleme
const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Sadece giriş yapan kullanıcıya "gelen" mesajları buluyoruz
    const messages = await Message.find({ receiver: userId })
      .populate('sender', 'firstName lastName') // Sadece gönderenin ad/soyadını alıyoruz
      .populate('listing', 'title') // İlanın başlığını alıyoruz
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ mesaj: "Mesajlar getirilemedi.", hata: error.message });
  }
};

// 3. Mesajı Okundu İşaretleme
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;

    const message = await Message.findOneAndUpdate(
      { _id: messageId, receiver: userId }, // Sadece alıcı okundu olarak işaretleyebilir
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ mesaj: "Mesaj bulunamadı veya bu işlem için yetkiniz yok." });
    }

    res.status(200).json({ mesaj: "Mesaj okundu olarak işaretlendi.", message });
  } catch (error) {
    res.status(500).json({ mesaj: "İşlem sırasında hata oluştu.", hata: error.message });
  }
};

// 4. Gelen Mesajı Silme
const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;

    const deletedMessage = await Message.findOneAndDelete({
      _id: messageId,
      receiver: userId // Sadece mesajı alan kişi kendi kutusundan silebilir
    });

    if (!deletedMessage) {
      return res.status(404).json({ mesaj: "Silinecek mesaj bulunamadı." });
    }

    res.status(200).json({ mesaj: "Mesaj başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ mesaj: "Mesaj silinirken hata oluştu.", hata: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage
};