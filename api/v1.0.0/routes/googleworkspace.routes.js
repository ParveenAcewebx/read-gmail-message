var express = require("express");
var router = express.Router();
const controller = require("../controllers/googleworkspace.controller");
router.get("/googleworkspace/readEmail", controller.readEmail);
module.exports = router;
