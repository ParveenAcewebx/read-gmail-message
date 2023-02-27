// https://cloud.mongodb.com/v2/63ecc644ca0d14026902a08b#/metrics/replicaSet/63ecc6ade9fae142dd55054e/explorer/test/kittens/find
// parveen.ace@yopmail.com/ &AtPs@9QL
const config = require("../../../config/db.config");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const { Sequelize, Op } = require("sequelize");
const exchangesDbObj = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

mongoose.connect(config.MONGODBHOST);

const db = {};

db.Sequelize = Sequelize;
db.exchangesDbObj = exchangesDbObj;
db.Op = Op;

module.exports = db;
