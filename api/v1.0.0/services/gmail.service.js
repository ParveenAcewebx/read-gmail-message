require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");
const gmailModel = require("../models/gmail.model");

var axios = require("axios");
var qs = require("qs");
// IMP Link: https://www.youtube.com/watch?v=tGDn3V-mIOM
// https://developers.google.com/identity/protocols/oauth2/web-server
// https://developers.google.com/identity/protocols/oauth2

module.exports = {
  async getRefreshTokenByEmailId(email) {
    return await gmailModel.findOne({ email: email });
  },
  async getAccessToken(refreshToken) {
    try {
      var data = qs.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://oauth2.googleapis.com/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };

      let response = await axios(config);
      console.log("response.dataresponse.data", response.data);
      return response.data.access_token;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw new Error(e);
    }
  },
  async getRefreshToken(data) {
    try {
      var data = qs.stringify({
        code: data.code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      });
      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://oauth2.googleapis.com/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };

      let response = await axios(config);
      console.log("response.dataresponse.data", response.data);
      if (response.data.refresh_token == undefined) {
        throw new Error(
          "You have already the access of Gmail! If you want the latest token then please delete the app first from this (https://myaccount.google.com/u/0/permissions) link"
        );
      }
      return response.data.refresh_token;
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw new Error(
        e?.response?.data?.error +
          " | error_description " +
          e?.response?.data?.error_description || e
      );
    }
  },

  async add(data) {
    try {
      gmailModel.findOne({ email: data.email }, function (err, docs) {
        if (err) {
          // No record found
          let result = new gmailModel(data);
          result.save();
        } else {
          gmailModel.updateOne(
            { email: data.email },
            { refreshToken: data.refreshToken },
            function (err, docs) {
              if (err) {
                logger.errorLog.log(
                  "error",
                  commonHelper.customizeCatchMsg(err)
                );
                throw new Error(err);
              } else {
                return true;
              }
            }
          );
        }
      });
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      throw new Error(e);
    }
  },
};
