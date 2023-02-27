var express = require("express");
var router = express.Router();
const controller = require("../controllers/tevo.controller");
router.get("/tevo/getAllEvents", controller.getAllEvents);
module.exports = router;
