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
// 3. Kendi İlanlarını Listeleme Fonksiyonu
const getMyListings = async (req, res) => {
  try {
    // Şimdilik URL'den gelen 'owner' bilgisini okuyoruz. 
    // Eğer URL'de gönderilmezse varsayılan olarak senin adını arayacak.
    const ownerName = req.query.owner || "Emre Taspinar";

    // Veritabanında owner alanı bu isme eşit olan TÜM ilanları bul
    // .sort({ createdAt: -1 }) kısmı en yeni eklenen ilanın en üstte gelmesini sağlar
    const myListings = await Listing.find({ owner: ownerName }).sort({ createdAt: -1 });

    // 200: İşlem başarılı
    res.status(200).json(myListings);
  } catch (error) {
    res.status(500).json({ mesaj: "İlanlar getirilirken bir hata oluştu.", hata: error });
  }
};

// 4. İlan Bilgilerini Güncelleme Fonksiyonu
const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // Kullanıcının gönderdiği yeni verileri alıyoruz

    // Veritabanında ilanı bul ve güncelle. 
    // { new: true } parametresi, işlemin ardından bize ilanın güncellenmiş son halini döndürür.
    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedListing) {
      return res.status(404).json({ mesaj: "Güncellenecek ilan bulunamadı." });
    }

    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({ mesaj: "İlan güncellenirken bir hata oluştu.", hata: error });
  }
};

// 5. Tek Bir İlanın Detaylarını Görüntüleme Fonksiyonu
const getListingById = async (req, res) => {
  try {
    const { id } = req.params; // URL'den ID'yi al
    
    // Veritabanında o ID'ye sahip ilanı bul
    const listing = await Listing.findById(id);

    // Eğer ilan yoksa veya silinmişse 404 döndür
    if (!listing) {
      return res.status(404).json({ mesaj: "İlan bulunamadı." });
    }

    // İlan bulunduysa 200 koduyla detayları gönder
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ mesaj: "İlan detayları getirilirken bir hata oluştu.", hata: error });
  }
};

// 6. İlanı Tamamen Silme Fonksiyonu
const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    // findByIdAndDelete komutu veriyi bulur ve tek seferde siler
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ mesaj: "Silinecek ilan bulunamadı." });
    }

    // 204 No Content genelde silme işlemleri için kullanılır ama 
    // başarılı mesajı dönmek için 200 de tercih edilebilir.
    res.status(200).json({ mesaj: "İlan başarıyla sistemden kaldırıldı." });
  } catch (error) {
    res.status(500).json({ mesaj: "İlan silinirken bir hata oluştu.", hata: error });
  }
};

// FİNAL EXPORTS LİSTESİ
module.exports = {
  addListing,
  uploadPhotos,
  getMyListings,
  updateListing,
  getListingById,
  deleteListing // SON GÖREV
};