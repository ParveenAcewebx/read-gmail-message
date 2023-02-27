var express = require("express");
var router = express.Router();
const controller = require("../controllers/test.controller");
router.get("/deepak", controller.deepak);
module.exports = router;
