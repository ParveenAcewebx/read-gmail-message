require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const { check, validationResult } = require("express-validator/check");
const { google } = require("googleapis");
const axios = require("axios");
const gmailServices = require("../services/gmail.service");

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});
module.exports = {
  async getAuthTokenUrl(req, res) {
    try {
      let scope = "https://mail.google.com";
      let redirectURL = "http://localhost:8000/api/v1.0.0/gmail/readAuthToken";
      let clientId =
        "808257875677-aofocdtncea3b979vnvi35lkqq7heimr.apps.googleusercontent.com";
      let authUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=${redirectURL}&client_id=${clientId}`;
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            { authUrl: authUrl },
            "Auth URL Generated successfully! Open this url in browser to get Auth Token"
          )
        );
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      return res
        .status(400)
        .send({ status: false, message: e.message, data: [] });
    }
  },
  async readAuthToken(req, res) {
    try {
      return res.status(200).send(
        commonHelper.parseSuccessRespose(
          {
            responseBody: req.query,
          },
          "Auth Code Generated successfully!"
        )
      );
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      return res
        .status(400)
        .send({ status: false, message: e.message, data: [] });
    }
  },
  async __getAccessTokenByAuthToken(req, res) {
    try {
      let code = req.body.code;
      let URL = "http://localhost:8000/api/v1.0.0/gmail/readAuthToken";

      let redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?code=${code}&client_secret=${clientSecret}&grant_type=authorization_code&redirect_uri=${URL}&client_id=808257875677-aofocdtncea3b979vnvi35lkqq7heimr.apps.googleusercontent.com`;
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            { authUrl: redirectUrl },
            "Auth URL Generated successfully! Open this url in browser to get Auth Token"
          )
        );
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      return res
        .status(400)
        .send({ status: false, message: e.message, data: [] });
    }
  },
  async generateRefreshToken(req, res) {
    try {
      if (
        req.query.code == undefined ||
        req.query.code == "" ||
        req.query.email == undefined ||
        req.query.email == ""
      ) {
        return res.status(200).send(
          commonHelper.parseErrorRespose({
            email: "Email and code is required",
          })
        );
      }

      let refreshToken = await gmailServices.getRefreshToken(req.query);
      console.log("refreshToken", refreshToken);
      await gmailServices.add({
        refreshToken,
        email: req.query.email,
      });
      return res.status(200).send(
        commonHelper.parseSuccessRespose(
          {
            responseBody: req.query,
          },
          "Refresh code Generated successfully!"
        )
      );
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      return res
        .status(400)
        .send({ status: false, message: e.message, data: [] });
    }
  },

  async readEmail(req, res) {
    try {
      if (
        req.query.email == undefined ||
        req.query.email == "" ||
        req.query.subject == undefined ||
        req.query.subject == ""
      ) {
        return res.status(200).send(
          commonHelper.parseErrorRespose({
            email: "Email and subject is required",
          })
        );
      }
      let email = req.query.email;
      let subject = req.query.subject;
      // const url = `https://gmail.googleapis.com/gmail/v1/users/pkumar@lewanddowski.com/profile`;
      const url = `https://gmail.googleapis.com//gmail/v1/users/${email}/messages?q=is:unread`;
      const refreshTokenObj = await gmailServices.getRefreshTokenByEmailId(
        email
      );
      if (refreshTokenObj === null) {
        throw new Error(
          "Please generate Auth token first from this (/api/v1.0.0/gmail/getAuthTokenUrl) API"
        );
      }
      const token = await gmailServices.getAccessToken(
        refreshTokenObj.refreshToken
      );
      const config = {
        method: "get",
        url: url,
        headers: {
          Authorization: `Bearer ${token} `,
          "Content-type": "application/json",
        },
      };

      const response = await axios(config);
      let allUnreadEmails = response.data;
      console.log("allUnreadEmails", allUnreadEmails.messages);
      let allUnreadEmailsHeaders = [];
      await Promise.all(
        allUnreadEmails.messages.map(async (item) => {
          const readEmailurl = `https://gmail.googleapis.com//gmail/v1/users/pkumar@lewanddowski.com/messages/${item.id}`;
          const config = {
            method: "get",
            url: readEmailurl,
            headers: {
              Authorization: `Bearer ${token} `,
              "Content-type": "application/json",
            },
          };

          const singleEmail = await axios(config);
          console.log("singleEmail", singleEmail.data);
          let allHeaders = singleEmail.data.payload.headers;
          let obj = allHeaders.find((o) => o.name === "Subject");
          allUnreadEmailsHeaders.push(obj.value);
        })
      );
      const fiteredHeader = allUnreadEmailsHeaders.filter((h) => {
        return h.includes(subject);
      });
      return res
        .status(200)
        .send(
          commonHelper.parseSuccessRespose(
            { allUnreadEmailsHeaders: fiteredHeader },
            "Email read successfully"
          )
        );
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      return res
        .status(400)
        .send({ status: false, message: e.message, data: [] });
    }
  },
};
