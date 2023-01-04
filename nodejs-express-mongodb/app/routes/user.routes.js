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

  router.get("/mail/:userMail", users.findByMail);

  router.put("/:id", users.modifyMail);

  //router.put("/:uid", users.modfifyMDP);

  router.delete("/:id", users.delete);

  router.delete("/", users.deleteAll);

  app.use("/api/users", router);
};
