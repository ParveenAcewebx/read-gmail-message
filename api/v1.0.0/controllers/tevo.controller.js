const axios = require("axios");
const tevoModel = require("../models/tevo.model");
var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
module.exports = {
  async getAllEvents(req, res) {
    try {
      let events = await tevoModel.getAllEvents(1);

      return res.status(200).send({ status: true, data: events });
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      return res
        .status(400)
        .send({ status: false, message: e.message, data: [] });
    }
  },
};
