var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");

// kitty.find().then(() => console.log('meow'));

module.exports = {
  async deepak(req, res) {
    res.status(200).json({ name: "API Function name DEEPAK" });
  },
  async user(req, res) {
    res.status(200).json({ name: "API Function name user" });
  },
};
