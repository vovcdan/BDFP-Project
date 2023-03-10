/**
 * Configuration des routes pour récupérer ou accéder
 * aux différentes données pour les films
 */

module.exports = (app) => {
  const movie = require("../controllers/movie.controller.js");

  var router = require("express").Router();

  // Create a new movie
  router.post("/", movie.create);

  router.post("/:uid", movie.addFilmToList);

  // Retrieve all movies
  router.get("/", movie.findAll);

  // Retrieve a list of user
  router.get("/:uid", movie.getListOfUser);

  // Retrieve a single movie with id
  router.get("/omdb/:uid/:omdbID", movie.findOne);

  router.get("/year/:uid/:dateVision", movie.findByDateVision);

  router.get("/location/:uid/:cinema", movie.findByLocation);

  router.get("/accompagnateurs/:uid/:accompagnateurs", movie.findByAccompagnateurs);

  router.get("/note/:uid/:note", movie.findByNote);

  router.get("/avis/:uid/:avis", movie.findByAvis);

  // Update a movie with id
  router.put("/:uid/:omdbID", movie.update);

  // Delete a movie with id
  router.delete("/:uid/movie/:omdbID", movie.deleteMovieById);

  // Create a new movie
  router.delete("/", movie.deleteAll);

  app.use("/api/movies", router);
};
