const { gmail_v1, google } = require("googleapis");

async function main() {
  const authClient = new google.auth.JWT({
    keyFile: "./config/emailblocktest.json", // Service account key file
    scopes: ["https://mail.google.com/"], // Very important to use appropriate scopes. This one gives full access (only if you gave this to the service account too)
    subject: "pkumar@lewanddowski.com", // This is an email address that exists in your Google Workspaces account. The app will use this as 'me' during later execution.
  });

  // I'm not sure if this is necessary, but it visualizes that you are now logged in.
  await authClient.authorize();

  // Let's create a Gmail client via the googleapis package
  const gmail = new gmail_v1.Gmail({ auth: authClient });
  const response = await gmail.users.messages.list({
    userId: "me",
    q: "in:inbox is:unread", // Use this parameter to filter messages by label or query.
  });
  const messages = response.data.messages;

  for (const message of messages) {
    const { data } = await gmail.users.messages.get({
      userId: "me",
      id: message.id,
    });
    console.log("Single MSG:, ", data);
  }
}
main();
// https://github.com/googleapis/google-api-nodejs-client/issues/2418
//https://developers.google.com/gmail/api/reference/rest

// https://admin.google.com/u/0/ac/owl
