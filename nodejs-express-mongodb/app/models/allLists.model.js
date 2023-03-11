/**
 * Création d'un schema pour définir comment les enregistrements
 * seront fait dans mongoDB pour le film
 */

 module.exports = (mongoose) => {
    const allLists = mongoose.model(
      "allLists",
      mongoose.Schema({
        uid: String,
        titrelist: String,
        shared: Boolean,
        "movies": [{
          titre: String,
          omdbID: String,
          tmdbID: String,
          dateVision: String,
          cinema: String,
          accompagnateurs: String,
          avis: String,
          note: String,
        }]
      })
    );
  
    return allLists;
  };
  