const axios = require("axios");

const db = require("../models");
var commonModel = require("../models/common.model");

let returnData = [];
module.exports = {
  async __getEventById(eventId, eventSlug, cookie, pageNo = 1) {
    let postData = JSON.stringify({
      CurrentPage: pageNo,
      PageSize: 50,
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://www.stubhub.com/${eventSlug}/event/${eventId}/`,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      data: postData,
    };

    let events = await axios(config);
    let eventData = events.data;
    let totalItem = eventData.TotalCount;
    let totalPage = Math.ceil(totalItem / 50);

    let allEvents = eventData.Items;
    let currentPage = eventData.CurrentPage;
    for (let event of allEvents) {
      let singleEvent = {
        id: event.Id,
        eventId: event.EventId,
        section: event.Section,
        sectionId: event.SectionId,
        rowx: event.Row,
        price: event.Price,
        priceWithFees: event.PriceWithFees,
        rawPrice: event.RawPrice,
        quantityRange: event.QuantityRange,
        seats: event.Seats,
        isUsersListing: event.IsUsersListing,
      };

      // await commonModel.add("stubhub", singleEvent);

      returnData.push(singleEvent);
    }

    if (totalPage > currentPage) {
      await this.__getEventById(eventId, eventSlug, cookie, currentPage + 1);
    }
    return returnData;
  },

  async getEventById(eventId, eventSlug, cookie) {
    try {
      // await db.exchangesDbObj.query("TRUNCATE `exchanges`.`stubhub`;");
      return await this.__getEventById(eventId, eventSlug, cookie, 1);
    } catch (err) {
      throw new Error(err);
    }
  },
};
