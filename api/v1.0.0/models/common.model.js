var db = require("../models");

module.exports = {
  async add(table, postData) {
    try {
      var qry = `insert into ${table} set `;
      for (const [key, value] of Object.entries(postData)) {
        qry += `${key} = '${value}',`;
      }
      qry = qry.slice(0, -1);
      let [queryRes] = await db.exchangesDbObj.query(qry);
      return queryRes;
    } catch (err) {
      // loggerV1.errorLog.log("error", commonHelper.customizeCatchMsg(err));
      return false;
    }
  },
  async update(table, postData, where) {
    try {
      var qry = `update ${table} set `;
      for (const [key, value] of Object.entries(postData)) {
        qry += `${key} = '${value}',`;
      }
      qry = qry.slice(0, -1);

      qry += `where 1=1 `;

      for (const [k, v] of Object.entries(where)) {
        qry += `and ${k} = '${v}' `;
      }
      let [queryRes] = await db.exchangesDbObj.query(qry);
      return queryRes;
    } catch (err) {
      // loggerV1.errorLog.log("error", commonHelper.customizeCatchMsg(err));
      return false;
    }
  },

  async isRecordExist(table, where) {
    try {
      var qry = `SELECT * from ${table} `;
      qry += `where 1=1 `;

      for (const [k, v] of Object.entries(where)) {
        qry += `and ${k} = '${v}' `;
      }
      let [queryRes] = await db.exchangesDbObj.query(qry, {
        type: db.exchangesDbObj.QueryTypes.SELECT,
      });
      if (queryRes) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      // loggerV1.errorLog.log("error", commonHelper.customizeCatchMsg(err));
      return false;
    }
  },
};
