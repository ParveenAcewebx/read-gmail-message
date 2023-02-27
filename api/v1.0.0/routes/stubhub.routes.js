var express = require("express");
var router = express.Router();
const controller = require("../controllers/stubhub.controller");
router.post("/stubhub/scrapeByEventId", controller.scrapeByEventId);
router.post(
  "/stubhub/addNewEvent",
  [controller.validate("addNewEvent")],
  controller.addNewEvent
);
router.get("/stubhub/getAllEvents", controller.getAllEvents);
module.exports = router;
