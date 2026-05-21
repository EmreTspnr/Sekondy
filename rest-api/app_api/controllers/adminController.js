const mongoose = require('mongoose');
const redis = require('../services/redis');
const rabbitmq = require('../services/rabbitmq');

const Listing = mongoose.model('Listing');
const User = mongoose.model('User');
const Report = mongoose.model('Report');

const getListingId = (req) => (
  req.params.listingId ||
  req.params.adId ||
  req.body.listingId ||
  req.body.adId
);

exports.reportListing = async (req, res) => {
  try {
    const listingId = getListingId(req);
    const { reason } = req.body;

    if (!listingId || !reason) {
      return res.status(400).json({ mesaj: 'Sikayet icin ilan kimligi ve neden gereklidir.' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ mesaj: 'Sikayet edilecek ilan bulunamadi.' });
    }

    const report = await Report.create({
      listing: listingId,
      reportedBy: req.user.userId,
      reason
    });

    res.status(201).json({ mesaj: 'Ilan basariyla sikayet edildi.', report });
  } catch (error) {
    res.status(500).json({ mesaj: 'Sikayet olusturulamadi.', hata: error.message });
  }
};

exports.approveListing = async (req, res) => {
  try {
    const listingId = getListingId(req);
    const listing = await Listing.findByIdAndUpdate(
      listingId,
      { status: 'approved' },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ mesaj: 'Ilan bulunamadi.' });
    }

    // RabbitMQ: İlan sahibine 'İlanınız Yayında' maili/bildirimi gitmesi için kuyruğa mesaj yolla
    rabbitmq.publishToQueue('IlanOnaylandi', {
      adId: listing._id,
      adTitle: listing.title,
      ownerId: listing.owner,
      onaylayanAdmin: req.user.userId, // İşlemi yapan yönetici
      timestamp: new Date()
    });

    // Admin bir ilan onayladığında, Redis'teki bekleyen ilanlar listesi eskimiş demektir.
    // Önbelleği temizleyelim ki bir dahaki sefere güncel veriler çekilsin.
    await redis.del('admin:pendingAds');
    await redis.del('showcase:listings');
    if (listing.category) await redis.del(`category:${listing.category}`);

    res.status(200).json({ mesaj: 'Ilan basariyla onaylandi.', listing });
  } catch (error) {
    res.status(500).json({ mesaj: 'Ilan onaylanirken hata olustu.', hata: error.message });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { isSuspended: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ mesaj: 'Kullanici bulunamadi.' });
    }

    res.status(200).json({ mesaj: 'Kullanici hesabi askiya alindi.', user });
  } catch (error) {
    res.status(500).json({ mesaj: 'Kullanici askiya alinamadi.', hata: error.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listingId = getListingId(req);
    const deletedListing = await Listing.findByIdAndDelete(listingId);

    if (!deletedListing) {
      return res.status(404).json({ mesaj: 'Ilan bulunamadi.' });
    }

    // Redis önbelleklerini temizle (Silinen ilan artık görünmesin)
    await redis.del(`ad:${listingId}`);
    await redis.del('showcase:listings');
    if (deletedListing.category) {
      await redis.del(`category:${deletedListing.category}`);
    }

    res.status(200).json({ mesaj: 'Ilan sistemden tamamen silindi.' });
  } catch (error) {
    res.status(500).json({ mesaj: 'Ilan silinirken hata olustu.', hata: error.message });
  }
};

exports.getPendingListings = async (_req, res) => {
  try {
    // 1. Önce Redis Cache'den kontrol et (Anahtar: admin:pendingAds)
    const cachedPendingAds = await redis.get('admin:pendingAds');
    if (cachedPendingAds) {
      console.log('Onay bekleyen ilanlar Redis üzerinden getirildi.');
      return res.status(200).json(JSON.parse(cachedPendingAds));
    }

    // 2. Redis'te yoksa Veritabanından (MongoDB) çek
    const pendingListings = await Listing.find({ status: 'pending' }).sort({ createdAt: -1 });

    // 3. Çekilen bu veriyi 10 dakikalığına (600 saniye) Redis'e kaydet
    await redis.set('admin:pendingAds', JSON.stringify(pendingListings), 'EX', 600);

    res.status(200).json(pendingListings);
  } catch (error) {
    res.status(500).json({ mesaj: 'Onay bekleyen ilanlar getirilemedi.', hata: error.message });
  }
};

exports.getReportedListings = async (_req, res) => {
  try {
    const reportedListings = await Report.find()
      .populate('listing', 'title summary description price status')
      .sort({ createdAt: -1 });

    res.status(200).json(reportedListings);
  } catch (error) {
    res.status(500).json({ mesaj: 'Sikayet edilen ilanlar getirilemedi.', hata: error.message });
  }
};