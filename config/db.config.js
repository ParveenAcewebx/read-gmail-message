const username = encodeURIComponent("parveen_kumar");
const password = encodeURIComponent("KxfGSwNK1qRnBmly");
module.exports = {
  // MONGODBHOST: `mongodb+srv://${username}:${password}@parveen.8xv2hhk.mongodb.net/?retryWrites=true&w=majority`,
  MONGODBHOST: `mongodb+srv://${username}:${password}@lawns-smallvenues.qjokq.mongodb.net/?retryWrites=true&w=majority`,
  HOST: "mysql.lewanddowski.com",
  USER: "usr_exchange",
  PASSWORD: "&0}ip}6YiNbF",
  DB: "exchanges",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
