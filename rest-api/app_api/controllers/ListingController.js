const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');

// 1. İlan Ekleme Fonksiyonu
const addListing = async (req, res) => {
  try {
    const { title, price, category, listingType, condition, description, location, owner } = req.body;

    if (!title || !price || !category || !description || !location) {
      return res.status(400).json({ mesaj: "Lütfen tüm zorunlu (*) alanları doldurun." });
    }

    const newListing = await Listing.create({
      title,
      price,
      category,
      listingType,
      condition,
      description,
      location,
      owner,
      photos: [] 
    });

    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ mesaj: "İlan eklenirken bir hata oluştu.", hata: error });
  }
};

// 2. Fotoğraf Yükleme Fonksiyonu
const uploadPhotos = async (req, res) => {
  try {
    const { id } = req.params; 
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ mesaj: "İlan bulunamadı." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ mesaj: "Lütfen en az bir fotoğraf yükleyin." });
    }

    // Yüklenen resimlerin dosya yollarını (isimlerini) bir diziye alıyoruz
    const photoUrls = req.files.map(file => `/uploads/${file.filename}`);

    // İlanın 'photos' dizisine yeni resimleri ekle ve kaydet
    listing.photos.push(...photoUrls);
    await listing.save(); 

    res.status(200).json({ mesaj: "Fotoğraflar başarıyla eklendi", photos: listing.photos });
  } catch (error) {
    res.status(500).json({ mesaj: "Fotoğraf yüklenirken bir hata oluştu.", hata: error });
  }
};

// Modülleri dışarı aktarıyoruz
module.exports = {
  addListing,
  uploadPhotos
};