require("dotenv").config();

const gmailAuth = {
  type: "OAuth2",
  user: "pkumar@lewanddowski.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "Siddhant <pkumar@lewanddowski.com>",
  to: "pkumar@lewanddowski.com",
  subject: "Gmail API NodeJS",
};

module.exports = {
  gmailAuth,
  mailoptions,
};
