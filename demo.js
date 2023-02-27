const { JWT } = require("google-auth-library");
//THE PATH TO YOUR SERVICE ACCOUNT CRENDETIALS JSON FILE
const keys = require("./config/reademail-378612-6881cdfbd98d.json");

async function main() {
  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
  });
  // const url = `https://dns.googleapis.com/dns/v1/projects/${keys.project_id}`;
  // const url = `https://gmail.googleapis.com/gmail/v1/users/parveen@acewebx.com/profile`;
  const url = `https://gmail.googleapis.com`;
  try {
    const res = await client.request({ url });
  } catch (e) {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", e.response.data.error);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", e.response);
  }
}
main().catch(console.error);
