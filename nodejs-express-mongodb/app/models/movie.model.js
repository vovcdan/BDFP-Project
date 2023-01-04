/**
 * Création d'un schema pour définir comment les enregistrements
 * seront fait dans mongoDB pour le film
 */

module.exports = (mongoose) => {
  const Movie = mongoose.model(
    "movie",
    mongoose.Schema({
      movies: [
        {
          titre: String,
          omdbID: String,
          tmdbID: String,
          dateVision: String,
          cinema: String,
          accompagnateurs: String,
          avis: String,
          note: String,
        },
      ],
      uid: String,
    })
  );

  return Movie;
};
