/**
 * Configuration de la BD
 * Attribution de l'url et les modeles
 */

const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.movie = require("./movie.model.js")(mongoose);
db.user = require("./user.model.js")(mongoose);
db.allLists = require("./allLists.model.js")(mongoose);
db.commonList = require("./commonList.model.js")(mongoose);
db.historyField = require("./historyField.model.js")(mongoose);

module.exports = db;