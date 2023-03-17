/**
 * Création d'un schema pour définir comment les enregistrements
 * seront fait dans mongoDB pour le film
 */

module.exports = (mongoose) => {
    const commonList = mongoose.model(
      "commonList",
      mongoose.Schema({
        uids: [String],
        titrelist: String,
        common: Boolean,
        "movies": [{
          titre: String,
          omdbID: String,
          tmdbID: String,
        }]
      })
    );
  
    return commonList;
  };
  