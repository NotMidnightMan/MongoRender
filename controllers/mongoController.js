const { findPartById } = require('../models/mongoModel');

async function getPart(req, res) {
  const partID = req.params.item;
  console.log("Looking for: { partID: '" + partID + "' }");
  try {
    const part = await findPartById(partID);
    res.send('Found this: ' + JSON.stringify(part));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving part');
  }
}

module.exports = { getPart };