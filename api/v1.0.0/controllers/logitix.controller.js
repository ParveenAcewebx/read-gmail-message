const axios = require("axios");
const logitixModel = require("../models/logitix.model");

let returnData = [];
const __getAllEvents = async (pageNo = 1) => {
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
    await __getAllEvents(currentPage + 1);
  }
  return returnData;
};

const __getEventByProductionId = async (productionId) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.preview.autoprocessor.com/V03/ApexInventoryService/GetTicketGroups?ProductionId=${productionId}`,
    auth: {
      username: "LewDowskiCapitalLLC_apiuser",
      password: "jLdz>PLy5&",
    },
  };

  let event = await axios(config);
  // return event.headers;
  return event.data;
};
module.exports = {
  async getEventsFromDb(req, res) {
    var queryRes = await logitixModel.getAllEvents();
    if (queryRes === false) {
      return res.status(200).send({ status: false, message: "Error In Db" });
    }

    return res.status(200).send({ status: true, data: queryRes });
  },

  async getAllEvents(req, res) {
    try {
      let events = await __getAllEvents(1);

      return res.status(200).send({ status: true, data: events });
    } catch (e) {
      return res
        .status(400)
        .send({ status: false, message: e.message, data: [] });
    }
  },

  async getEventByProductionId(req, res) {
    try {
      let productionId = req.body.productionId;
      let events = await __getEventByProductionId(productionId);

      return res.status(200).send({ status: true, data: events });
    } catch (e) {
      return res
        .status(400)
        .send({ status: false, message: e.message, data: [] });
    }
  },
};
