const mongoose = require("mongoose");

const SheventSchema = new mongoose.Schema({
  performerName: String,
  dateOfEvent: String,
  urlSlug: String,
  shid: String,
});
module.exports = mongoose.model("Shenvent", SheventSchema);
