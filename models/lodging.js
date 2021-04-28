/*
 * Lodgings schema and data accessor methods.
 */

const { extractValidFields } = require('../lib/validation');
const { getDbReference } = require('../lib/mongo');

/*
 * Schema for a lodging.
 */
const LodgingSchema = {
  name: { required: true },
  description: { required: false },
  // address: { required: true },
  street: { required: true },
  city: { required: true },
  state: { required: true },
  zip: { required: true },
  price: { required: true },
  ownerid: { required: true }
};
exports.LodgingSchema = LodgingSchema;

async function getLodgingsPage(page) {
  const db = getDbReference();
  const collection = db.collection('lodgings');

  const count = await collection.countDocuments();
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    lodgings: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getLodgingsPage = getLodgingsPage;

async function insertNewLodging(lodging) {
  lodging = extractValidFields(lodging, LodgingSchema);
  const db = getDbReference();
  const collection = db.collection('lodgings');
  const result = await collection.insertOne(lodging);
  console.log("  -- result:", result);
  return result.insertedId;
}
exports.insertNewLodging = insertNewLodging;
