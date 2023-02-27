const shModel = require("../models/sh.model");
var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
module.exports = {
  async add(data) {
    try {
      await shModel.insertMany(data);
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw new Error(e);
    }
  },
  async getAll() {
    try {
      const response = await shModel.find();
      return response;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw new Error(e);
    }
  },
};
