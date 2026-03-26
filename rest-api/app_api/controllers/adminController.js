const Listing = require('../models/Listing');
const User = require('../models/User');
const Report = require('../models/Report');

// 1. İlan Şikayet Etme
exports.reportListing = async (req, res) => {
    try {
        const { listingId } = req.params;
        const { reason } = req.body;
        // İleride Furkan Auth kısmını bitirdiğinde şikayet eden kişiyi req.user.id ile alacaksınız.
        // Şimdilik test edebilmek için body'den alalım veya sabit bırakalım.
        const reportedBy = req.body.reportedBy;

        const report = new Report({
            listing: listingId,
            reportedBy: reportedBy,
            reason: reason
        });

        await report.save();
        res.status(201).json({ message: 'İlan başarıyla şikayet edildi.', report });
    } catch (error) {
        res.status(500).json({ error: 'Şikayet oluşturulamadı', details: error.message });
    }
};

// 2. İlan Durumunu Onaylama
exports.approveListing = async (req, res) => {
    try {
        const { listingId } = req.params;
        const listing = await Listing.findByIdAndUpdate(
            listingId,
            { status: 'approved' },
            { new: true }
        );

        if (!listing) return res.status(404).json({ message: 'İlan bulunamadı.' });
        res.status(200).json({ message: 'İlan başarıyla onaylandı.', listing });
    } catch (error) {
        res.status(500).json({ error: 'İlan onaylanırken hata oluştu.', details: error.message });
    }
};

// 3. Kullanıcı Hesabını Askıya Alma
exports.suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(
            userId,
            { isSuspended: true },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        res.status(200).json({ message: 'Kullanıcı hesabı askıya alındı.', user });
    } catch (error) {
        res.status(500).json({ error: 'Kullanıcı askıya alınamadı.', details: error.message });
    }
};

// 4. Uygunsuz İlanı Silme
exports.deleteListing = async (req, res) => {
    try {
        const { listingId } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(listingId);

        if (!deletedListing) return res.status(404).json({ message: 'İlan bulunamadı.' });
        res.status(200).json({ message: 'İlan sistemden tamamen silindi.' });
    } catch (error) {
        res.status(500).json({ error: 'İlan silinirken hata oluştu.', details: error.message });
    }
};

// 5. Onay Bekleyen İlanları Listeleme
exports.getPendingListings = async (req, res) => {
    try {
        const pendingListings = await Listing.find({ status: 'pending' });
        res.status(200).json(pendingListings);
    } catch (error) {
        res.status(500).json({ error: 'Onay bekleyen ilanlar getirilemedi.', details: error.message });
    }
};

// 6. Şikayet Edilen İlanları Listeleme
exports.getReportedListings = async (req, res) => {
    try {
        // Şikayetleri getirirken, hangi ilanın şikayet edildiğini de detaylarıyla populate ediyoruz
        const reportedListings = await Report.find().populate('listing', 'title description price status');
        res.status(200).json(reportedListings);
    } catch (error) {
        res.status(500).json({ error: 'Şikayet edilen ilanlar getirilemedi.', details: error.message });
    }
};