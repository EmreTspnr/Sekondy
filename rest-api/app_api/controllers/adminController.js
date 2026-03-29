const mongoose = require('mongoose');

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

    res.status(200).json({ mesaj: 'Ilan sistemden tamamen silindi.' });
  } catch (error) {
    res.status(500).json({ mesaj: 'Ilan silinirken hata olustu.', hata: error.message });
  }
};

exports.getPendingListings = async (_req, res) => {
  try {
    const pendingListings = await Listing.find({ status: 'pending' }).sort({ createdAt: -1 });
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
