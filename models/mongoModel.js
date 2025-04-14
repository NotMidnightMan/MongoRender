const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://jakeadmin:admin29!@mongocluster.z6vdfo7.mongodb.net/?retryWrites=true&w=majority&appName=MongoCluster";

async function findPartById(partID) {
  const client = new MongoClient(uri);
  try {
    const database = client.db('MongoRenderDB');
    const parts = database.collection('MongoRender');
    const query = { partID };
    return await parts.findOne(query);
  } finally {
    await client.close();
  }
}

module.exports = { findPartById };