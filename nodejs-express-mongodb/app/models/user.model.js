/**
 * Création d'un schema pour définir comment les enregistrements
 * seront fait dans mongoDB pour un utilisateur
 */

module.exports = (mongoose) => {
  const User = mongoose.model(
    "user",
    mongoose.Schema({
      email: String,
      mdp: String,
    })
  );

  return User;
};
