const mongoose = require("mongoose");

const GmailScheme = new mongoose.Schema({
  email: String,
  refreshToken: String,
});
module.exports = mongoose.model("gmail_auth", GmailScheme);
