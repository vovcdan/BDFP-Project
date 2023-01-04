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

  // Update a movie with id
  router.put("/:uid", movie.update);

  // Delete a movie with id
  router.delete("/:uid/movie/:titre", movie.deleteMovieById);

  // Create a new movie
  router.delete("/", movie.deleteAll);

  app.use("/api/movies", router);
};
