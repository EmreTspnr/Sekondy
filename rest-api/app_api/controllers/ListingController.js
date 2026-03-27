const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');

const addListing = async (req, res) => {
  try {
    const { title, price, category, listingType, condition, description, location } = req.body;
    const owner = req.user.userId; // DİKKAT: Artık kimliği token'dan alıyor

    if (!title || !price || !category || !description || !location) {
      return res.status(400).json({ mesaj: "Lütfen tüm zorunlu (*) alanları doldurun." });
    }

    const newListing = await Listing.create({
      title, price, category, listingType, condition, description, location, owner, photos: [] 
    });
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ mesaj: "İlan eklenirken hata oluştu.", hata: error.message });
  }
};

const uploadPhotos = async (req, res) => {
  try {
    const { id } = req.params; 
    const listing = await Listing.findById(id);

    if (!listing) return res.status(404).json({ mesaj: "İlan bulunamadı." });
    if (!req.files || req.files.length === 0) return res.status(400).json({ mesaj: "Fotoğraf yükleyin." });

    const photoUrls = req.files.map(file => `/uploads/${file.filename}`);
    listing.photos.push(...photoUrls);
    await listing.save(); 

    res.status(200).json({ mesaj: "Fotoğraflar eklendi", photos: listing.photos });
  } catch (error) {
    res.status(500).json({ mesaj: "Fotoğraf yüklenirken hata oluştu.", hata: error.message });
  }
};

const getMyListings = async (req, res) => {
  try {
    const ownerId = req.user.userId; // DİKKAT: Sadece giriş yapanın kendi ilanlarını bulur
    const myListings = await Listing.find({ owner: ownerId }).sort({ createdAt: -1 });
    res.status(200).json(myListings);
  } catch (error) {
    res.status(500).json({ mesaj: "İlanlar getirilemedi.", hata: error.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; 
    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedListing) return res.status(404).json({ mesaj: "Güncellenecek ilan bulunamadı." });
    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({ mesaj: "İlan güncellenemedi.", hata: error.message });
  }
};

const getListingById = async (req, res) => {
  try {
    const { id } = req.params; 
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ mesaj: "İlan bulunamadı." });
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ mesaj: "İlan detayları getirilemedi.", hata: error.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) return res.status(404).json({ mesaj: "Silinecek ilan bulunamadı." });
    res.status(200).json({ mesaj: "İlan başarıyla sistemden kaldırıldı." });
  } catch (error) {
    res.status(500).json({ mesaj: "İlan silinemedi.", hata: error.message });
  }
};

module.exports = {
  addListing, uploadPhotos, getMyListings, updateListing, getListingById, deleteListing
};