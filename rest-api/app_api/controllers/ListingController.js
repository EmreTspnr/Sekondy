const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');
const SavedSearch = mongoose.model('SavedSearch');
const Message = mongoose.model('Message');
const User = mongoose.model('User');
const redis = require('../services/redis');
const rabbitmq = require('../services/rabbitmq');

const EDITABLE_FIELDS = [
  'title',
  'price',
  'category',
  'listingType',
  'condition',
  'summary',
  'description',
  'location'
];

const isBlank = (value) => typeof value !== 'string' || value.trim() === '';

const buildSummary = (summary, description) => {
  if (typeof summary === 'string' && summary.trim() !== '') {
    return summary.trim();
  }

  if (typeof description === 'string' && description.trim() !== '') {
    return description.trim().slice(0, 160);
  }

  return '';
};

const ensureListingOwner = (listing, reqUser, res) => {
  if (!listing) {
    res.status(404).json({ mesaj: 'Ilan bulunamadi.' });
    return false;
  }

  const ownerStr = String(listing.owner?._id || listing.owner);
  const userStr = String(reqUser.userId);

  if (ownerStr !== userStr && !reqUser.isAdmin) {
    res.status(403).json({ mesaj: 'Bu ilan uzerinde islem yapma yetkiniz yok.' });
    return false;
  }

  return true;
};

const pickEditableFields = (payload) => {
  const updateData = {};

  for (const field of EDITABLE_FIELDS) {
    if (payload[field] !== undefined) {
      if (field === 'price') {
        const val = parseFloat(String(payload[field]).replace(',', '.'));
        if (!isNaN(val)) updateData[field] = val;
      } else {
        updateData[field] = payload[field];
      }
    }
  }

  return updateData;
};
const triggerSearchNotifications = async (newListing) => {
  try {
    const savedSearches = await SavedSearch.find({ notificationsEnabled: true });
    if (!savedSearches || savedSearches.length === 0) return;

    let systemUser = await User.findOne({ email: 'sistem@sekondy.com' });
    if (!systemUser) {
      systemUser = await User.create({
        firstName: 'Sistem',
        lastName: 'Bildirimleri',
        email: 'sistem@sekondy.com',
        password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        isAdmin: true
      });
    }

    const { title, category, condition, location, price, owner } = newListing;

    for (const search of savedSearches) {
      if (String(search.user) === String(owner)) continue;

      let match = true;
      if (search.keyword && !title.toLowerCase().includes(search.keyword.toLowerCase())) match = false;
      if (search.category && search.category !== category) match = false;
      if (search.condition && search.condition !== condition) match = false;
      if (search.location && !location.toLowerCase().includes(search.location.toLowerCase())) match = false;
      if (search.minPrice > 0 && price < search.minPrice) match = false;
      if (search.maxPrice > 0 && price > search.maxPrice) match = false;

      if (match) {
        let keywordText = search.keyword || search.category || title;
        await Message.create({
          sender: systemUser._id,
          receiver: search.user,
          listing: newListing._id,
          content: `Kayıtlı aramanız "${keywordText}" ile eşleşen yeni bir ilan eklendi: ${title}. Fiyat: ${price} TL.`
        });
      }
    }
  } catch (error) {
    console.error("Arama bildirimleri tetiklenirken hata oluştu:", error);
  }
};

const addListing = async (req, res) => {
  try {
    const {
      title,
      price,
      category,
      listingType,
      condition,
      summary,
      description,
      location
    } = req.body;
    const owner = req.user.userId;

    if (
      isBlank(title) ||
      price === undefined ||
      price === null ||
      isBlank(category) ||
      isBlank(description) ||
      isBlank(location)
    ) {
      return res.status(400).json({ mesaj: 'Lutfen tum zorunlu (*) alanlari doldurun.' });
    }

    const newListing = await Listing.create({
      title: title.trim(),
      price,
      category: category.trim(),
      listingType,
      condition,
      summary: buildSummary(summary, description),
      description: description.trim(),
      location: location.trim(),
      owner,
      photos: []
    });

    triggerSearchNotifications(newListing);

    // RabbitMQ: Publish message to queue
    rabbitmq.publishToQueue('YeniIlanOnayBekliyor', {
      listingId: newListing._id,
      title: newListing.title,
      owner: newListing.owner,
      timestamp: new Date()
    });
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ mesaj: 'Ilan eklenirken hata olustu.', hata: error.message });
  }
};

const uploadPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!ensureListingOwner(listing, req.user, res)) {
      return;
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ mesaj: 'Fotograf yukleyin.' });
    }

    const photoUrls = req.files.map((file) => file.path);
    listing.photos.push(...photoUrls);
    await listing.save();

    res.status(200).json({ mesaj: 'Fotograflar eklendi', photos: listing.photos });
  } catch (error) {
    res.status(500).json({ mesaj: 'Fotograf yuklenirken hata olustu.', hata: error.message });
  }
};

const getMyListings = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    // Hem ObjectId hem de eski string formatındaki owner değerlerini eşleştir
    const myListings = await Listing.find({
      $or: [
        { owner: ownerId },
        { owner: String(ownerId) }
      ]
    }).sort({ createdAt: -1 });
    res.status(200).json(myListings);
  } catch (error) {
    res.status(500).json({ mesaj: 'Ilanlar getirilemedi.', hata: error.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!ensureListingOwner(listing, req.user, res)) {
      return;
    }

    const updateData = pickEditableFields(req.body);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ mesaj: 'Guncellenecek en az bir gecerli alan gonderin.' });
    }

    if (updateData.description !== undefined && updateData.summary === undefined && !listing.summary) {
      updateData.summary = buildSummary(undefined, updateData.description);
    }

    listing.set(updateData);
    await listing.save();

    // Redis önbelleğini temizle (Kullanıcı eski ilanı görmesin)
    await redis.del(`ad:${id}`);

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ mesaj: 'Ilan guncellenemedi.', hata: error.message });
  }
};

const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check Redis Cache first
    const cachedListing = await redis.get(`ad:${id}`);
    if (cachedListing) {
      console.log('Serving from Redis Cache:', `ad:${id}`);
      return res.status(200).json(JSON.parse(cachedListing));
    }

    const listing = await Listing.findById(id).populate('owner', 'firstName lastName phone');

    if (!listing) {
      return res.status(404).json({ mesaj: 'Ilan bulunamadi.' });
    }

    // Save to Redis Cache for 1 hour (3600 seconds)
    await redis.set(`ad:${id}`, JSON.stringify(listing), 'EX', 3600);

    res.status(200).json(listing);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ mesaj: 'Gecersiz ilan kimligi.' });
    }

    res.status(500).json({ mesaj: 'Ilan detaylari getirilemedi.', hata: error.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!ensureListingOwner(listing, req.user, res)) {
      return;
    }

    await listing.deleteOne();

    // Redis önbelleğini temizle (Silinen ilan görünmesin)
    await redis.del(`ad:${id}`);

    res.status(200).json({ mesaj: 'Ilan basariyla sistemden kaldirildi.' });
  } catch (error) {
    res.status(500).json({ mesaj: 'Ilan silinemedi.', hata: error.message });
  }
};

module.exports = {
  addListing,
  uploadPhotos,
  getMyListings,
  updateListing,
  getListingById,
  deleteListing
};
