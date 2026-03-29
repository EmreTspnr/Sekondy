const mongoose = require('mongoose');
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

    res.status(201).json({ mesaj: 'Mesaj basariyla gonderildi.', message: newMessage });
  } catch (error) {
    res.status(500).json({ mesaj: 'Mesaj gonderilirken hata olustu.', hata: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const messages = await Message.find({ receiver: userId })
      .populate('sender', 'firstName lastName')
      .populate('listing', 'title')
      .sort({ createdAt: -1 });

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

    res.status(200).json({ mesaj: 'Mesaj okundu olarak isaretlendi.', message });
  } catch (error) {
    res.status(500).json({ mesaj: 'Islem sirasinda hata olustu.', hata: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;

    const deletedMessage = await Message.findOneAndDelete({
      _id: messageId,
      receiver: userId
    });

    if (!deletedMessage) {
      return res.status(404).json({ mesaj: 'Silinecek mesaj bulunamadi.' });
    }

    res.status(200).json({ mesaj: 'Mesaj basariyla silindi.' });
  } catch (error) {
    res.status(500).json({ mesaj: 'Mesaj silinirken hata olustu.', hata: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage
};
