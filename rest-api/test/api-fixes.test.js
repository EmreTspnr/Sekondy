const assert = require('node:assert/strict');
const mongoose = require('mongoose');

require('../app_api/models/listing');
require('../app_api/models/user');
require('../app_api/models/savedSearch');
require('../app_api/models/follow');
require('../app_api/models/favorite');
require('../app_api/models/message');
require('../app_api/models/report');

const Listing = mongoose.model('Listing');
const SavedSearch = mongoose.model('SavedSearch');
const listingController = require('../app_api/controllers/ListingController');
const savedSearchController = require('../app_api/controllers/SavedSearchController');
const router = require('../app_api/routes/index');

const createMockResponse = () => ({
  statusCode: 200,
  body: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  }
});

const tests = [
  {
    name: 'addListing derives summary when client omits it',
    async run() {
      const originalCreate = Listing.create;
      let capturedPayload;

      Listing.create = async (payload) => {
        capturedPayload = payload;
        return { _id: 'listing-1', ...payload };
      };

      try {
        const req = {
          body: {
            title: 'Temiz araba',
            price: 250000,
            category: 'vasita',
            description: 'Bakimli ve dusuk kilometreli arac',
            location: 'Istanbul'
          },
          user: { userId: 'user-1' }
        };
        const res = createMockResponse();

        await listingController.addListing(req, res);

        assert.equal(res.statusCode, 201);
        assert.equal(capturedPayload.owner, 'user-1');
        assert.equal(capturedPayload.summary, 'Bakimli ve dusuk kilometreli arac');
      } finally {
        Listing.create = originalCreate;
      }
    }
  },
  {
    name: 'updateListing blocks non-owners',
    async run() {
      const originalFindById = Listing.findById;

      Listing.findById = async () => ({ owner: 'different-user' });

      try {
        const req = {
          params: { id: 'listing-1' },
          body: { title: 'Yeni baslik' },
          user: { userId: 'user-1' }
        };
        const res = createMockResponse();

        await listingController.updateListing(req, res);

        assert.equal(res.statusCode, 403);
        assert.equal(res.body.mesaj, 'Bu ilan uzerinde islem yapma yetkiniz yok.');
      } finally {
        Listing.findById = originalFindById;
      }
    }
  },
  {
    name: 'saved search notification update accepts the documented enabled field',
    async run() {
      const originalFindOneAndUpdate = SavedSearch.findOneAndUpdate;
      let capturedUpdate;

      SavedSearch.findOneAndUpdate = async (_query, update) => {
        capturedUpdate = update;
        return { _id: 'search-1', notificationsEnabled: update.notificationsEnabled };
      };

      try {
        const req = {
          params: { searchId: 'search-1' },
          body: { enabled: false },
          user: { userId: 'user-1' }
        };
        const res = createMockResponse();

        await savedSearchController.updateSearchNotifications(req, res);

        assert.equal(res.statusCode, 200);
        assert.equal(capturedUpdate.notificationsEnabled, false);
      } finally {
        SavedSearch.findOneAndUpdate = originalFindOneAndUpdate;
      }
    }
  },
  {
    name: 'router keeps showcase routes ahead of dynamic listing detail routes',
    run() {
      const getPaths = router.stack
        .filter((layer) => layer.route && layer.route.methods.get)
        .map((layer) => layer.route.path);

      assert.ok(getPaths.indexOf('/listings/showcase') < getPaths.indexOf('/listings/:id'));
      assert.ok(getPaths.includes('/ads/showcase'));
      assert.ok(getPaths.includes('/categories/:categoryId/listings'));
    }
  }
];

const run = async () => {
  let failed = 0;

  for (const testCase of tests) {
    try {
      await testCase.run();
      console.log(`PASS ${testCase.name}`);
    } catch (error) {
      failed += 1;
      console.error(`FAIL ${testCase.name}`);
      console.error(error);
    }
  }

  if (failed > 0) {
    process.exitCode = 1;
    return;
  }

  console.log('All smoke tests passed.');
};

run().catch((error) => {
  console.error('Test runner failed.');
  console.error(error);
  process.exitCode = 1;
});
