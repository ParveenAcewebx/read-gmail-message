const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const auths = require("basic-auth");

const swaggerDocumentV_1_0_0 = require("./api/apidocs/apiDoc.v1.0.0.json");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: "*" }));

// parse requests of content-type - application/json
app.use(bodyParser.json());
// app.use(forms.array());
// // parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.get("/", (req, res) => {
  res.send("Hello Typescript with Node.js!");
});

// Add Password Layer Start
let options = {};
app.use(
  "/apidocs",
  (req, res, next) => {
    let user = auths(req);
    if (
      user === undefined ||
      user["name"] !== "admin" ||
      user["pass"] !== "admin"
    ) {
      res.statusCode = 401;
      res.setHeader("WWW-Authenticate", 'Basic realm="Node"');
      res.end("Unauthorized");
    } else {
      next();
    }
  },
  swaggerUi.serveFiles(swaggerDocumentV_1_0_0, options),
  swaggerUi.setup(swaggerDocumentV_1_0_0)
);

// Add Password Layer End

app.use(
  "/apidocs",
  swaggerUi.serveFiles(swaggerDocumentV_1_0_0, options),
  swaggerUi.setup(swaggerDocumentV_1_0_0)
);

app.use("/api", require("./api"));

app.listen(PORT, () => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
