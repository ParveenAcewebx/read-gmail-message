const db = require("../models");
module.exports = {
  async getAllEvents() {
    try {
      let query = `SELECT * from logitix_events`;
      var [resultObj] = await db.exchangesDbObj.query(query);
      if (resultObj) {
        return resultObj;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};
