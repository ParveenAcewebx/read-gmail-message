var express = require("express");
var router = express.Router();
const controller = require("../controllers/logitix.controller");
router.get("/logitix/getAllEvents", controller.getAllEvents);
router.get("/logitix/getAllEventsFromDb", controller.getEventsFromDb);
router.post(
  "/logitix/getEventByProductionId",
  controller.getEventByProductionId
);
module.exports = router;
