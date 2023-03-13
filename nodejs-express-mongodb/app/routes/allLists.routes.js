/**
 * Configuration des routes pour récupérer ou accéder
 * aux différentes données pour les utilisateurs
 */

module.exports = (app) => {
  const allLists = require("../controllers/allLists.controller.js");

  var router = require("express").Router();

  router.post("/", allLists.create);

  router.post("/share", allLists.createShare);

  router.post("/:uid/:titrelist", allLists.addFilmToAList);

  router.get("/:uid/:titrelist", allLists.findByIdAndTitle);

  router.get("/:uid", allLists.findById);

  router.get("/", allLists.findAll);

  router.get("/isShared/:uid/:titrelist", allLists.isSharedList)

  router.get("/:uid/:titrelist/:omdbID", allLists.findMovieFromOneList)

  router.put("/:uid/:omdbID", allLists.update)

  router.delete("/", allLists.deleteAll);

  router.delete("/:idListe", allLists.deleteOne);

  router.delete("/:uid/:omdbID", allLists.deleteMovieFromAllLists);

  router.delete("/:uid/:titrelist/:omdbID", allLists.deleteMovieFromList);

  app.use("/api/allLists", router);
};