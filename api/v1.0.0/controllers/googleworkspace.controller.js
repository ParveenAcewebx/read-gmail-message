require("dotenv").config();
var commonHelper = require("../helper/common.helper");
const logger = require("../../../config/winston");

const { gmail_v1, google } = require("googleapis");

module.exports = {
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

      const authClient = new google.auth.JWT({
        keyFile: "./config/emailblocktest.json", // Service account key file
        scopes: ["https://mail.google.com/"], // Very important to use appropriate scopes. This one gives full access (only if you gave this to the service account too)
        // subject: "pkumar@lewanddowski.com", // This is an email address that exists in your Google Workspaces account. The app will use this as 'me' during later execution.
        subject: email, // This is an email address that exists in your Google Workspaces account. The app will use this as 'me' during later execution.
      });

      // I'm not sure if this is necessary, but it visualizes that you are now logged in.
      await authClient.authorize();

      // Let's create a Gmail client via the googleapis package
      const gmail = new gmail_v1.Gmail({ auth: authClient });
      const messageResponse = await gmail.users.messages.list({
        userId: "me",
        q: "in:inbox is:unread", // Use this parameter to filter messages by label or query.
      });
      const allUnreadEmails = messageResponse.data.messages;

      let allUnreadEmailsSubjects = [];
      if (allUnreadEmails) {
        await Promise.all(
          allUnreadEmails.map(async (message) => {
            const { data } = await gmail.users.messages.get({
              userId: "me",
              id: message.id,
            });
            let singleEmail = data;

            // return res.status(200).send(singleEmail);
            let allHeaders = singleEmail.payload.headers;
            let obj = allHeaders.find((o) => o.name === "Subject");
            allUnreadEmailsSubjects.push(obj.value);
          })
        );

        const fiteredHeader = allUnreadEmailsSubjects.filter((h) => {
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
      }
    } catch (e) {
      logger.errorLog.log("error", commonHelper.customizeCatchMsg(e));
      return res
        .status(400)
        .send({ status: false, message: e.message, data: [] });
    }
  },
};
