const { google } = require("googleapis");
const { authenticate } = require("@google-cloud/local-auth");

const auth = new google.auth.GoogleAuth({
  // Replace 'path/to/credentials.json' with the path to your service account credentials JSON file.
  keyFile: "./keys.json",
  scopes: ["https://gmail.googleapis.com"],
});

async function main() {
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.list({
    userId: "testing@reademail-378612.iam.gserviceaccount.com",
    q: "in:inbox", // Use this parameter to filter messages by label or query.
  });
  /* 
  const messages = response.data.messages;
  for (const message of messages) {
    const { data } = await gmail.users.messages.get({
      userId: "me",
      //   id: message.id,
    });
    console.log(data);
  } */
  console.log("gmail", response);
}
main();
