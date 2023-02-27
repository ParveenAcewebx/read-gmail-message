var express = require("express");
var router = express.Router();
router.use(require("./test.routes"));
router.use(require("./logitix.routes"));
router.use(require("./stubhub.routes"));
router.use(require("./tevo.routes"));
router.use(require("./gmail.routes"));
router.use(require("./googleworkspace.routes"));

module.exports = router;
