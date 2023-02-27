var express = require("express");
var router = express.Router();
const controller = require("../controllers/gmail.controller");
router.get("/gmail/getAuthTokenUrl", controller.getAuthTokenUrl);
router.get("/gmail/readAuthToken", controller.readAuthToken);
router.get("/gmail/generateRefreshToken", controller.generateRefreshToken);
router.get("/gmail/readEmail", controller.readEmail);
module.exports = router;
