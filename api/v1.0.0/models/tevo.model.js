const axios = require("axios");

const db = require("../models");
const logger = require("../../../config/winston");
var commonHelper = require("../helper/common.helper");

let returnData = [];

module.exports = {
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
        return queryRes;
      } else {
        return false;
      }
    } catch (err) {
      loggerV1.errorLog.log("error", commonHelper.customizeCatchMsg(err));
      return false;
    }
  },

  async __getAllEvents(pageNo = 1) {
    var config = {
      method: "get",
      url: `https://api.sandbox.ticketevolution.com/v9/events?page=${pageNo}`,
      headers: {
        "X-Token": "d9f567481378940eceecf0d6dd8930f2",
      },
    };

    let events = await axios(config);
    let eventData = events.data;
    let allEvents = eventData.events;
    let totalItem = eventData.total_entries;
    let limit = eventData.per_page;
    let currentPage = eventData.current_page;
    let totalPage = Math.ceil(totalItem / limit);

    for (let event of allEvents) {
      let singleEvent = {
        tevoId: event.id,
        category: event.category?.name || "-",
        parentCategory: event.category?.parent?.name || "-",
        performer: event.performances?.[0]?.performer?.name || "-",
        venue: event.venue?.name || "-",
        location: event.venue?.location || "-",
        shid: event.stubhub_id,
        eventDatetime: event.occurs_at,
        eventName: event.name,
        availableCount: event.available_count,
        popularityScore: event.popularity_score,
        productsEticketCount: event.products_eticket_count,
      };
      returnData.push(singleEvent);
    }
    console.log("totalPage", totalPage);
    console.log("currentPage", currentPage);
    // if (totalPage > currentPage) {
    if (5 > currentPage) {
      console.log("Reading Page no: ", currentPage);
      await this.__getAllEvents(currentPage + 1);
    }
    return returnData;
  },

  async getAllEvents(pageNo) {
    try {
      return await this.__getAllEvents(pageNo);
    } catch (err) {
      throw new Error(err);
    }
  },
};
