/**
 * Configuration des routes pour récupérer ou accéder
 * aux différentes données pour les utilisateurs
 */

module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  router.post("/", users.create);

  router.get("/", users.findAll);

  router.get("/:id", users.findOne);

  router.get("/mail/:userMail/password/:password", users.findByMailAndPassword);

  router.get("/mail/:userMail", users.findByMail);

  router.get("/members/:uid", users.findMembersNames)

  router.put("/:id", users.modifyMail);

  router.delete("/:id", users.delete);

  router.delete("/", users.deleteAll);

  app.use("/api/users", router);
};
