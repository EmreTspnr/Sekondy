const mongoose = require('mongoose');
const rabbitmq = require('../services/rabbitmq');
const redis = require('../services/redis');
const Message = mongoose.model('Message');
const User = mongoose.model('User');
const Listing = mongoose.model('Listing');

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, content } = req.body;
    const listingId = req.body.listingId || req.body.adId;

    if (senderId === receiverId) {
      return res.status(400).json({ mesaj: 'Kendinize mesaj gonderemezsiniz.' });
    }

    if (!content) {
      return res.status(400).json({ mesaj: 'Mesaj icerigi bos olamaz.' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ mesaj: 'Mesaj gonderilecek kullanici bulunamadi.' });
    }

    if (listingId) {
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ mesaj: 'Mesajla iliskili ilan bulunamadi.' });
      }
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      listing: listingId,
      content
    });

    // RabbitMQ: Aliciya gercek zamanli bildirim gondermek icin kuyruga yaz
    rabbitmq.publishToQueue('YeniMesaj', {
      mesajId: newMessage._id,
      gondererenId: senderId,
      aliciId: receiverId,
      icerik: content,
      timestamp: new Date()
    });

    // Mesaj gonderilince hem alicinin hem de gonderenin mesaj onbellegi eskimis olur, temizle
    await redis.del(`messages:${receiverId}`);
    await redis.del(`messages:${senderId}`);

    res.status(201).json({ mesaj: 'Mesaj basariyla gonderildi.', message: newMessage });
  } catch (error) {
    res.status(500).json({ mesaj: 'Mesaj gonderilirken hata olustu.', hata: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Redis Cache-Aside: Once onbellekten kontrol et
    const cacheKey = `messages:${userId}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Mesajlar Redis'ten getirildi: ${cacheKey}`);
      return res.status(200).json(JSON.parse(cached));
    }

    const messages = await Message.find({
      $or: [{ receiver: userId }, { sender: userId }],
      deletedBy: { $ne: userId }
    })
      .populate('sender', 'firstName lastName')
      .populate('receiver', 'firstName lastName')
      .populate('listing', 'title')
      .sort({ createdAt: 1 });

    // 2 dakika (120 sn) onbellege al
    await redis.set(cacheKey, JSON.stringify(messages), 'EX', 120);

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ mesaj: 'Mesajlar getirilemedi.', hata: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;

    const message = await Message.findOneAndUpdate(
      { _id: messageId, receiver: userId },
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ mesaj: 'Mesaj bulunamadi veya bu islem icin yetkiniz yok.' });
    }

    // Okundu isaretlenince onbellegi temizle (guncel durum gelmesi icin)
    await redis.del(`messages:${userId}`);

    res.status(200).json({ mesaj: 'Mesaj okundu olarak isaretlendi.', message });
  } catch (error) {
    res.status(500).json({ mesaj: 'Islem sirasinda hata olustu.', hata: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ mesaj: 'Silinecek mesaj bulunamadi.' });
    }

    if (message.sender.toString() !== userId && message.receiver.toString() !== userId) {
      return res.status(403).json({ mesaj: 'Bu mesaji silme yetkiniz yok.' });
    }

    if (!message.deletedBy.includes(userId)) {
      message.deletedBy.push(userId);
      await message.save();
    }

    // Silme sonrasi onbellegi temizle
    await redis.del(`messages:${userId}`);

    res.status(200).json({ mesaj: 'Mesaj basariyla silindi.' });
  } catch (error) {
    res.status(500).json({ mesaj: 'Mesaj silinirken hata olustu.', hata: error.message });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { partnerId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId }
      ]
    });

    if (!messages || messages.length === 0) {
      return res.status(404).json({ mesaj: 'Silinecek sohbet bulunamadi.' });
    }

    // Her mesaj icin deletedBy listesine kullaniciyi ekle
    for (let msg of messages) {
      if (!msg.deletedBy.includes(userId)) {
        msg.deletedBy.push(userId);
        await msg.save();
      }
    }

    // Onbellegi temizle
    await redis.del(`messages:${userId}`);

    res.status(200).json({ mesaj: 'Sohbet basariyla silindi.' });
  } catch (error) {
    res.status(500).json({ mesaj: 'Sohbet silinirken hata olustu.', hata: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
  deleteConversation
};