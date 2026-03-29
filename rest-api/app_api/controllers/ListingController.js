const mongoose = require('mongoose');
const Listing = mongoose.model('Listing');

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

const ensureListingOwner = (listing, userId, res) => {
  if (!listing) {
    res.status(404).json({ mesaj: 'Ilan bulunamadi.' });
    return false;
  }

  if (String(listing.owner) !== String(userId)) {
    res.status(403).json({ mesaj: 'Bu ilan uzerinde islem yapma yetkiniz yok.' });
    return false;
  }

  return true;
};

const pickEditableFields = (payload) => {
  const updateData = {};

  for (const field of EDITABLE_FIELDS) {
    if (payload[field] !== undefined) {
      updateData[field] = payload[field];
    }
  }

  return updateData;
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

    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ mesaj: 'Ilan eklenirken hata olustu.', hata: error.message });
  }
};

const uploadPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!ensureListingOwner(listing, req.user.userId, res)) {
      return;
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ mesaj: 'Fotograf yukleyin.' });
    }

    const photoUrls = req.files.map((file) => `/uploads/${file.filename}`);
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
    const myListings = await Listing.find({ owner: ownerId }).sort({ createdAt: -1 });
    res.status(200).json(myListings);
  } catch (error) {
    res.status(500).json({ mesaj: 'Ilanlar getirilemedi.', hata: error.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!ensureListingOwner(listing, req.user.userId, res)) {
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

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ mesaj: 'Ilan guncellenemedi.', hata: error.message });
  }
};

const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ mesaj: 'Ilan bulunamadi.' });
    }

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

    if (!ensureListingOwner(listing, req.user.userId, res)) {
      return;
    }

    await listing.deleteOne();
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
