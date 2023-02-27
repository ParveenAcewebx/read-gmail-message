const stubhubService = require("../services/stubhub.service");
const puppeteer = require("puppeteer");
var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");

const { check, validationResult } = require("express-validator/check");

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});
module.exports = {
  async scrapeByEventId(req, res) {
    try {
      let eventSlug = req.body.eventSlug;
      let eventId = req.body.eventId;

      const browser = await puppeteer.launch({
        headless: false,
        // args: ["--no-sandbox", "--disable-setuid-sandbox"],

        // executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      });
      const page = await browser.newPage();
      await page.goto("https://my.stubhub.com/secure/login");
      await page.waitForSelector('input[name="password"]');
      //await page.click(".col-md-4 a");

      // await page.waitForSelector("#username");
      await page.type('input[name="email"]', "", {
        delay: 10,
      });

      await page.type('input[name="password"]', "", { delay: 10 });
      await page.click("button.sc-fEOsli");

      await page.waitForNavigation();
      // Sample URL:  "https://www.stubhub.com/dave-matthews-band-the-woodlands-tickets-5-19-2023/event/151417181/?quantity=0"
      const response = await page.goto(
        `https://www.stubhub.com/${eventSlug}/event/${eventId}/?quantity=0`
      );

      const headers = response.headers();

      await page.waitForSelector("#modal-root");
      await page.click("#modal-root button");

      const cookies = await page.cookies();
      let customCookie = "";
      for (let c of cookies) {
        customCookie = customCookie + `${c.name}=${c.value};`;
      }

      var queryRes = await stubhubModel.getEventById(
        eventId,
        eventSlug,
        customCookie
      );
      browser.close();
      return res.status(400).send({
        status: true,
        data: queryRes,
        headers,
        customCookie,
      });
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));

      return res
        .status(400)
        .send({ status: false, message: e.message, data: [] });
    }
  },
  async addNewEvent(req, res) {
    try {
      const errors = myValidationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

      if (!errors.isEmpty()) {
        return res
          .status(200)
          .send(commonHelper.parseErrorRespose(errors.mapped()));
      }
      /*
        // Sample Data
      let data = [{
        performerName: "name",
        dateOfEvent: "DOE",
        urlSlug: "slut",
        shid: "shid",
      }]; */

      let response = await stubhubService.add(req.body.postData);

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            { response },
            "Recored added successfully"
          )
        );
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      return res
        .status(400)
        .send({ status: false, message: e.message, data: [] });
    }
  },

  async getAllEvents(req, res) {
    try {
      let response = await stubhubService.getAll();

      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            { items: response },
            "Recored added successfully"
          )
        );
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      return res
        .status(400)
        .send({ status: false, message: e.message, data: [] });
    }
  },
  validate(method) {
    switch (method) {
      case "addNewEvent": {
        return [
          check("postData")
            .not()
            .isEmpty()
            .withMessage("Post Data is Required"),
          check("postData.*.performerName")
            .not()
            .isEmpty()
            .withMessage("Performer Name is Required"),
          check("postData.*.dateOfEvent")
            .not()
            .isEmpty()
            .withMessage("Date Of Event is Required"),
          check("postData.*.urlSlug")
            .not()
            .isEmpty()
            .withMessage("Url Slug is Required"),
          check("postData.*.shid")
            .not()
            .isEmpty()
            .withMessage("SHID Slug is Required"),
        ];
      }
    }
  },
};
